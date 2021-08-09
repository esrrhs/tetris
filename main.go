package main

import (
	"flag"
	"github.com/esrrhs/go-engine/src/common"
	"github.com/esrrhs/go-engine/src/loggo"
	"os"
	"runtime/pprof"
)

var gBrick []Brick

/*
https://geek.oa.com/tetris/#/game
game.playFreq=1000
game.replayFreq=1
step='N,D19,N,D17,R2,D1,R1,D1,N,D17,L3,D2,N,D16,R1,D1,N,D15,R1,D1,R1,D2,N,C1,D15,R3,D1,R1,D2,N,C1,D14,R3,D1,R2,D1,N,C1,D14,L1,D2,L3,D2,N,C1,D15,R2,D1,N,C2,D15,L1,D3,N,D18,L1,D1,N,D16,L2,D1,L1,D1,N,C1,D16,L1,D1,N,D14,L1,D1,L1,D1,N,D15,R3,D3,N,D15,R1,D2,R1,N,C1,D14,L2,D1,L1,D1,N,C1,D16,N,D15,R3,D1,R1,D2,N,C3,D15,R3,D1,R2,D1,N,C1,D17,L1,D1,N,D18,N,D14,R2,D2,N,C1,D15,R3,D2,R1,N,C1,D15,L1,D1,N,D13,L2,D1,L1,D3,N,C1,D15,N,C1,D13,R1,D1,R1,D1,N,C1,D13,N,D10,L1,D1,L1,D3,N,C1,D10,L1,D1,L1,D1,N,C1,D11,R3,D7,N,C1,D12,R1,D1,R3,D3,N,D12,R1,D1,R3,D1,N,C1,D13,N,C3,D10,R1,D4,N,D12,R1,D1,N,D11,N,C1,D9,L1,D2,N,D8,R2,D1,R1,D3,N,C1,D8,L1,D1,N,D9,N,D7,R2,D1,R1,D3,N,D6,L1,D1,L1,D1,L1,D5,N,D7,L3,D1,L1,D1,N,D6,R2,D2,N,D7,N,D5,L1,D2,N,C3,D4,R2,D1,R2,D1,R1,D1,N,D6,L4,D1,N,D6,R2,D1,N,D5,L1,D1,N,D5,R4,D1,N,D4,L3,D1,N,D6,N,D3,R1,D1,R1,D1,N,D4,L2,D1,N,D2,R2,D1,R1,D1,R2,D1,N,C1,D2,L3,D1,L1,D1,N,D2,R2,D1,R1,D1,N,D4,N,D2,L3,D1,N,D2,R2,D1,R1,D1,N,D2,R4,D1,N,D3,L2,D1,N,D3,N,D1,L2,D1,N,R2,D1,R2,D1,N,D1,R1,D1,N'
game.pause();game.playRecord(step.split(','));
axios.post(`api/upload`, { record: step, score: 0 }).then(({ data }) => { console.log('提交结果', data); if(data.info) {console.log(data.info)} });
*/
func main() {
	defer common.CrashLog()

	nolog := flag.Int("nolog", 0, "write log file")
	noprint := flag.Int("noprint", 0, "print stdout")
	loglevel := flag.String("loglevel", "info", "log level")
	cpuprofile := flag.String("cpuprofile", "", "open cpuprofile")
	n := flag.Int("n", 10000, "brick num")
	algo := flag.Int("algo", 0, "choose algo")
	calcstep := flag.Int("calcstep", 4, "calc step")
	calcquickstep := flag.Int("calcquickstep", 12, "calc quick step")
	thread := flag.Int("thread", 8, "max thread")
	base_height := flag.Int("base_height", 12, "base height")
	findthread := flag.Int("findthread", 8, "find thread")
	usefind := flag.Int("usefind", 0, "use find score param")
	printbrick := flag.Int("printbrick", 0, "print brick")
	slowfilter := flag.Float64("slowfilter", 0.5, "slow filter")
	quickfilter := flag.Float64("quickfilter", 0.2, "quick filter")

	flag.Parse()

	level := loggo.LEVEL_INFO
	if loggo.NameToLevel(*loglevel) >= 0 {
		level = loggo.NameToLevel(*loglevel)
	}
	loggo.Ini(loggo.Config{
		Level:     level,
		Prefix:    "tetris",
		MaxDay:    3,
		NoLogFile: *nolog > 0,
		NoPrint:   *noprint > 0,
	})
	loggo.Info("start...")

	N := *n
	gRandom.Reset()

	for i := 0; i < common.MaxOfInt(100000, N); i++ {
		ty, stat := GetBrickInfo()
		gBrick = append(gBrick, Brick{ty, stat})
	}

	for i := 0; i < N && *printbrick > 0; i++ {
		loggo.Info("Brick %v %v %v %v \n%v", i, gBrick[i].Ty, TypeToName(gBrick[i].Ty), gBrick[i].Stat, gBrick[i].Draw())
	}

	if *cpuprofile != "" {
		f, err := os.Create(*cpuprofile)
		if err != nil {
			loggo.Error("Unable to create cpu profile: %v", err)
			return
		}
		pprof.StartCPUProfile(f)
		defer f.Close()
		defer pprof.StopCPUProfile()
	}

	OpenResultFile()

	if *usefind > 0 {
		AI6_SCORE = AI6_SCORE_FIND
	}

	switch *algo {
	case -1:
		testGrid()
		testFind(AI6_SCORE, *thread)
	case -2:
		FindScoreParam(AI6_SCORE, N, *calcstep, *calcquickstep, *thread, *base_height, *findthread, *slowfilter, *quickfilter)
	case -3:
		FindMaxBase(AI6_SCORE, N, *calcstep, *calcquickstep, *thread, *findthread, *slowfilter, *quickfilter)
	case 0:
		FindBestPathByOneStepScore(AI6_SCORE, N)
	case 1:
		FindBestPathBySeeNext(AI6_SCORE, N, *calcstep, *thread, *slowfilter)
	case 2:
		BackSearchBestPathByMixSeeNext(AI6_SCORE, N, *calcstep, *calcquickstep, *thread, *base_height, *slowfilter, *quickfilter)
	default:
		loggo.Error("wrong algo %v", *algo)
	}

}
