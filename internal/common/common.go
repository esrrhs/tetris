// Package common 提供通用的小工具函数。
package common

import (
	"fmt"
	"os"
	"runtime/debug"
)

// AbsInt 返回整数的绝对值。
func AbsInt(a int) int {
	if a < 0 {
		return -a
	}
	return a
}

// MaxOfInt 返回两个整数中较大的一个。
func MaxOfInt(a int, b int) int {
	if a > b {
		return a
	}
	return b
}

// MinOfInt 返回两个整数中较小的一个。
func MinOfInt(a int, b int) int {
	if a < b {
		return a
	}
	return b
}

// CrashLog 捕获 panic 并打印调用栈，用于在 goroutine 崩溃时留下现场。
//
// 它通常配合 defer 使用：
//
//	defer common.CrashLog()
//
// 如果当前 goroutine 正在 panic  recovering，它会把 panic 信息和调用栈
// 打印到标准错误，然后重新触发 panic，保留原有的崩溃语义。
func CrashLog() {
	err := recover()
	if err == nil {
		return
	}

	fmt.Fprintf(os.Stderr, "panic: %v\n", err)
	debug.PrintStack()

	// 重新抛出，保持 Go 默认的 panic 行为。
	panic(err)
}
