// Package loggo 是一个轻量级日志库。
//
// 它提供按天切分的日志文件、可配置的日志级别以及带前缀的格式化输出。
// 所有写入操作都是并发安全的，可被多个 goroutine 同时调用。
package loggo

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

// 日志级别。数值越大优先级越高，只有不低于当前配置级别的日志才会被输出。
const (
	LEVEL_DEBUG = iota
	LEVEL_INFO
	LEVEL_WARN
	LEVEL_ERROR
	LEVEL_FATAL
)

var levelNames = map[string]int{
	"debug": LEVEL_DEBUG,
	"info":  LEVEL_INFO,
	"warn":  LEVEL_WARN,
	"error": LEVEL_ERROR,
	"fatal": LEVEL_FATAL,
}

// NameToLevel 把日志级别的名字转换为对应的级别数值。
// 名字不区分大小写。如果名字无法识别则返回 -1。
func NameToLevel(name string) int {
	if level, ok := levelNames[strings.ToLower(strings.TrimSpace(name))]; ok {
		return level
	}
	return -1
}

// Config 是日志库的初始化配置。
type Config struct {
	// Level 是最低输出级别，不低于该级别的日志才会被输出。
	Level int
	// Prefix 是每条日志的前缀，用于区分不同的输出来源。
	Prefix string
	// MaxDay 是日志文件的最大保留天数，为 0 表示不自动清理旧日志。
	MaxDay int
	// NoLogFile 为 true 时只输出到标准输出，不写日志文件。
	NoLogFile bool
	// NoPrint 为 true 时只写日志文件，不输出到标准输出。
	NoPrint bool
}

// Logger 持有全局日志状态。
type Logger struct {
	mutex  sync.Mutex
	config Config
	file   *os.File
	// date 是当前日志文件对应的日期，用于判断是否需要切分新文件。
	date string
	// dir 是日志文件所在目录。
	dir string
}

var gLogger = &Logger{
	config: Config{Level: LEVEL_INFO},
	dir:    "log",
}

// Ini 使用给定的配置初始化全局日志库。
// 重复调用是安全的，后续调用会覆盖之前的配置。
func Ini(config Config) {
	gLogger.mutex.Lock()
	defer gLogger.mutex.Unlock()

	gLogger.config = config

	if gLogger.file != nil {
		gLogger.file.Close()
		gLogger.file = nil
		gLogger.date = ""
	}

	if config.NoLogFile {
		return
	}

	if err := os.MkdirAll(gLogger.dir, 0755); err != nil {
		// 无法创建日志目录时退化为只打印到标准输出，避免影响主流程。
		gLogger.config.NoLogFile = true
		return
	}

	if config.MaxDay > 0 {
		gLogger.removeExpired()
	}
}

// removeExpired 删除超过保留天数的日志文件。调用前必须持有锁。
func (logger *Logger) removeExpired() {
	deadline := time.Now().AddDate(0, 0, -logger.config.MaxDay)
	entries, err := os.ReadDir(logger.dir)
	if err != nil {
		return
	}
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".log") {
			continue
		}
		info, err := entry.Info()
		if err != nil || !info.ModTime().Before(deadline) {
			continue
		}
		os.Remove(filepath.Join(logger.dir, entry.Name()))
	}
}

// write 把一条格式化后的日志写入输出。调用前必须持有锁。
func (logger *Logger) write(level string, format string, args ...interface{}) {
	if NameToLevel(level) < logger.config.Level {
		return
	}

	var builder strings.Builder
	builder.WriteString(time.Now().Format("2006-01-02 15:04:05.000"))
	builder.WriteString(" [")
	builder.WriteString(level)
	builder.WriteString("]")
	if logger.config.Prefix != "" {
		builder.WriteString(" [")
		builder.WriteString(logger.config.Prefix)
		builder.WriteString("]")
	}
	builder.WriteString(" ")
	builder.WriteString(fmt.Sprintf(format, args...))
	builder.WriteString("\n")

	message := builder.String()

	if !logger.config.NoPrint {
		logger.print(message)
	}

	if !logger.config.NoLogFile {
		logger.writeFile(message)
	}
}

// print 把日志输出到标准输出。调用前必须持有锁。
func (logger *Logger) print(message string) {
	if logger.file != nil {
		// 有日志文件时用它的标准输出句柄，保证两份输出顺序一致。
		os.Stdout.WriteString(message)
		return
	}
	io.WriteString(os.Stdout, message)
}

// writeFile 把日志追加到当天的日志文件。调用前必须持有锁。
func (logger *Logger) writeFile(message string) {
	today := time.Now().Format("2006-01-02")

	if logger.file == nil || logger.date != today {
		if logger.file != nil {
			logger.file.Close()
			logger.file = nil
		}
		file, err := os.OpenFile(filepath.Join(logger.dir, "log_"+today+".log"),
			os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
		if err != nil {
			// 打开失败就退化为只打印到标准输出。
			logger.config.NoLogFile = true
			return
		}
		logger.file = file
		logger.date = today
	}

	logger.file.WriteString(message)
}

// Debug 输出一条 debug 级别的日志。
func Debug(format string, args ...interface{}) {
	gLogger.mutex.Lock()
	defer gLogger.mutex.Unlock()
	gLogger.write("debug", format, args...)
}

// Info 输出一条 info 级别的日志。
func Info(format string, args ...interface{}) {
	gLogger.mutex.Lock()
	defer gLogger.mutex.Unlock()
	gLogger.write("info", format, args...)
}

// Warn 输出一条 warn 级别的日志。
func Warn(format string, args ...interface{}) {
	gLogger.mutex.Lock()
	defer gLogger.mutex.Unlock()
	gLogger.write("warn", format, args...)
}

// Error 输出一条 error 级别的日志。
func Error(format string, args ...interface{}) {
	gLogger.mutex.Lock()
	defer gLogger.mutex.Unlock()
	gLogger.write("error", format, args...)
}

// Fatal 输出一条 fatal 级别的日志，然后退出进程。
func Fatal(format string, args ...interface{}) {
	gLogger.mutex.Lock()
	gLogger.write("fatal", format, args...)
	gLogger.mutex.Unlock()
	os.Exit(1)
}
