package main

import (
	"github.com/esrrhs/go-engine/src/common"
	"github.com/esrrhs/go-engine/src/loggo"
	"sort"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

func FindBestBase(ai6_score []float64, N int, g Grid, baseheight int, curbaseheight int, cur int, results []string, scores []int, extraheight int, maxwell int, progress *int) (bool, int, *Grid) {
	if cur == N {
		return false, 0, nil
	}

	brick := gBrick[cur]

	all := g.findAllMovPath(brick)
	if all.Len() <= 0 {
		return false, 0, nil
	}

	sort.Slice(all.List(), func(i, j int) bool {
		lmv := all.List()[i]
		rmv := all.List()[j]
		lscore := g.CalcBrickScore(brick, lmv, ai6_score)
		rscore := g.CalcBrickScore(brick, rmv, ai6_score)
		return lscore > rscore
	})

	for _, mv := range all.List() {
		tmp := g

		tmp.AddMovPath(brick, mv)
		scores[cur] = tmp.CalcScore()
		tmp.RemoveFullLine()
		path := mv.Opl.ToString()
		results[cur] = "N," + path + ","

		allok := true
		for cb := 0; cb <= curbaseheight; cb++ {
			if !tmp.IsFullExceptOneHole(MaxRow - 1 - cb) {
				allok = false
				break
			}
		}

		if !allok {
			continue
		}

		*progress++
		if *progress%10000 == 0 {
			loggo.Info("FindBase \n%vcur:%v", tmp.Draw(), cur)
		}

		if curbaseheight+1 >= baseheight {
			return true, cur, &tmp
		}

		ok, n, rg := FindBestBase(ai6_score, N, tmp, baseheight, curbaseheight+1, cur+1, results, scores, extraheight, maxwell, progress)
		if ok {
			return ok, n, rg
		}
	}

	for _, mv := range all.List() {
		tmp := g

		tmp.AddMovPath(brick, mv)
		scores[cur] = tmp.CalcScore()
		tmp.RemoveFullLine()
		path := mv.Opl.ToString()
		results[cur] = "N," + path + ","

		if g.IsBottomMoreThanOneHole(baseheight) {
			continue
		}
		if g.GetMaxWellHeight() > maxwell {
			continue
		}
		if g.GetMaxHeight(false) > baseheight+extraheight {
			continue
		}

		*progress++
		if *progress%10000 == 0 {
			loggo.Info("FindBase \n%vcur:%v", tmp.Draw(), cur)
		}

		ok, n, rg := FindBestBase(ai6_score, N, tmp, baseheight, curbaseheight, cur+1, results, scores, extraheight, maxwell, progress)
		if ok {
			return ok, n, rg
		}
	}

	return false, 0, nil
}

var gBaseHeightMap sync.Map

type BaseHeightInfo struct {
	ok     bool
	n      int
	score  int
	result string
	g      *Grid
}

func FindBase(ai6_score []float64, N int, baseheight int) (bool, int, int, string, *Grid) {

	v, ok := gBaseHeightMap.Load(baseheight)
	if ok {
		bi := v.(BaseHeightInfo)
		return bi.ok, bi.n, bi.score, bi.result, bi.g
	}

	extraheight := 2
	maxwell := 4

	var g Grid
	results := make([]string, N)
	scores := make([]int, N)
	progress := 0
	ok, total, rg := FindBestBase(ai6_score, N, g, baseheight, 0, 0, results, scores, extraheight, maxwell, &progress)
	if !ok {
		loggo.Error("FindBase fail")
		gBaseHeightMap.Store(baseheight, BaseHeightInfo{false, 0, 0, "", nil})
		return false, 0, 0, "", nil
	}

	result := strings.Join(results[0:total+1], "")
	result = strings.TrimRight(result, ",")
	totalscore := getTotalScores(scores[0 : total+1])
	loggo.Info("FindBase ok \n%vtotal:%v, score:%v", rg.Draw(), total+1, totalscore)
	loggo.Info("result is %v", result)

	gBaseHeightMap.Store(baseheight, BaseHeightInfo{true, total + 1, totalscore, result, rg})

	return true, total + 1, totalscore, result, rg
}

func FindMaxBase(ai6_score []float64, N int, step int, quickstep int, thread int, findthread int, slowfilter float64, quickfilter float64) {

	var job int32
	var lock sync.Mutex

	max := 0
	maxbaseheight := -1
	for i := 0; i < MaxRow-1; i++ {
		if int(job) < findthread {
			atomic.AddInt32(&job, 1)
			index := i
			go func() {
				defer common.CrashLog()
				defer atomic.AddInt32(&job, -1)

				score := BackSearchBestPathByMixSeeNext(ai6_score, N, step, quickstep, thread, index, slowfilter, quickfilter)
				loggo.Info("FindMaxBase is %v %v", index, score)
				if score > max {
					lock.Lock()
					if score > max {
						max = score
						maxbaseheight = index
					}
					lock.Unlock()
				}
			}()
		} else {
			score := BackSearchBestPathByMixSeeNext(ai6_score, N, step, quickstep, thread, i, slowfilter, quickfilter)
			loggo.Info("FindMaxBase is %v %v", i, score)
			if score > max {
				lock.Lock()
				if score > max {
					max = score
					maxbaseheight = i
				}
				lock.Unlock()
			}
		}
	}

	for job > 0 {
		time.Sleep(time.Millisecond * 100)
	}

	loggo.Info("score is %v", max)
	loggo.Info("max base height is %v", maxbaseheight)
}
