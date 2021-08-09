package main

import (
	"github.com/esrrhs/go-engine/src/common"
	"github.com/esrrhs/go-engine/src/loggo"
	"math"
	"sort"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

func FindNextStepMaxScore(ai6_score []float64, curGrid Grid, start int, index int, total int, thread int, quick float64) (int, float64, MovPath) {
	if index == total {
		return 0, 0, MovPath{}
	}

	brick := gBrick[start+index]
	all := curGrid.findAllMovPath(brick)
	if all.Len() <= 0 {
		return math.MinInt32, float64(math.MinInt32), MovPath{}
	}

	for i, mv := range all.List() {
		all.List()[i].Score = curGrid.CalcBrickScore(brick, mv, ai6_score)
	}

	if quick > 0 {
		sort.Slice(all.List(), func(i, j int) bool {
			lscore := all.List()[i].Score
			rscore := all.List()[j].Score
			return lscore > rscore
		})
	}

	listnum := len(all.List())
	if quick > 0 {
		listnum = common.MaxOfInt(int(float64(listnum)*quick), 1)
	}

	maxscore := float64(math.MinInt32)
	maxtetrisscore := math.MinInt32
	var maxmv MovPath

	if index == 0 && thread > 1 {
		var lock sync.Mutex
		var job int32
		minid := math.MaxInt32

		fn := func(id int, g Grid, inthread bool) {
			defer common.CrashLog()
			if inthread {
				defer atomic.AddInt32(&job, -1)
			}

			mv := all.List()[id]

			curscore := mv.Score

			g.AddMovPath(brick, mv)
			curtetrisscore := g.CalcScore()
			g.RemoveFullLine()
			sontetrisscore, sonscore, _ := FindNextStepMaxScore(ai6_score, g, start, index+1, total, thread, quick)

			score := curscore + sonscore
			tetrisscore := curtetrisscore + sontetrisscore

			if score >= maxscore {
				lock.Lock()
				if score > maxscore {
					maxtetrisscore = tetrisscore
					maxscore = score
					maxmv = mv
					minid = id
				} else if score == maxscore {
					if tetrisscore > maxtetrisscore {
						maxtetrisscore = tetrisscore
						maxmv = mv
						minid = id
					} else if tetrisscore == maxtetrisscore {
						if id < minid {
							maxmv = mv
							minid = id
						}
					}
				}
				lock.Unlock()
			}
		}

		for id, _ := range all.List()[0:listnum] {
			if int(job) < thread {
				atomic.AddInt32(&job, 1)
				go fn(id, curGrid, true)
			} else {
				fn(id, curGrid, false)
			}
		}

		for job > 0 {
			time.Sleep(time.Millisecond * 10)
		}

	} else {
		for _, mv := range all.List()[0:listnum] {
			curscore := mv.Score

			tmp := curGrid

			tmp.AddMovPath(brick, mv)
			curtetrisscore := tmp.CalcScore()
			tmp.RemoveFullLine()
			sontetrisscore, sonscore, _ := FindNextStepMaxScore(ai6_score, tmp, start, index+1, total, thread, quick)

			score := curscore + sonscore
			tetrisscore := curtetrisscore + sontetrisscore

			if score >= maxscore {
				if score > maxscore {
					maxtetrisscore = tetrisscore
					maxscore = score
					maxmv = mv
				} else if score == maxscore {
					if tetrisscore > maxtetrisscore {
						maxtetrisscore = tetrisscore
						maxmv = mv
					}
				}
			}
		}
	}

	return maxtetrisscore, maxscore, maxmv
}

func FindNextStepMaxScoreGame(ai6_score []float64, curGrid Grid, start int, index int, total int, thread int, quick float64) (int, float64, MovPath) {
	if index == total {
		return 0, 0, MovPath{}
	}

	brick := gBrick[start+index]
	all := curGrid.findAllMovPath(brick)
	if all.Len() <= 0 {
		return math.MinInt32, float64(math.MinInt32), MovPath{}
	}

	for i, mv := range all.List() {
		all.List()[i].Score = curGrid.CalcBrickScore(brick, mv, ai6_score)
	}

	if quick > 0 {
		sort.Slice(all.List(), func(i, j int) bool {
			lscore := all.List()[i].Score
			rscore := all.List()[j].Score
			return lscore > rscore
		})
	}

	listnum := len(all.List())
	if quick > 0 {
		listnum = common.MaxOfInt(int(float64(listnum)*quick), 1)
	}

	maxscore := float64(math.MinInt32)
	maxtetrisscore := math.MinInt32
	var maxmv MovPath

	if index == 0 && thread > 1 {
		var lock sync.Mutex
		var job int32
		minid := math.MaxInt32

		fn := func(id int, g Grid, inthread bool) {
			defer common.CrashLog()
			if inthread {
				defer atomic.AddInt32(&job, -1)
			}

			mv := all.List()[id]

			curscore := mv.Score

			g.AddMovPath(brick, mv)
			curtetrisscore := g.CalcScore()
			g.RemoveFullLine()

			sontetrisscore, sonscore, _ := FindNextStepMaxScoreGame(ai6_score, g, start, index+1, total, thread, quick)

			score := curscore + sonscore
			tetrisscore := curtetrisscore + sontetrisscore

			if tetrisscore < curtetrisscore {
				tetrisscore = curtetrisscore
			}

			if tetrisscore >= maxtetrisscore {
				lock.Lock()
				if tetrisscore > maxtetrisscore {
					maxtetrisscore = tetrisscore
					maxscore = score
					maxmv = mv
					minid = id
				} else if tetrisscore == maxtetrisscore {
					if score > maxscore {
						maxscore = score
						maxmv = mv
						minid = id
					} else if score == maxscore {
						if id < minid {
							maxmv = mv
							minid = id
						}
					}
				}
				lock.Unlock()
			}
		}

		for id, _ := range all.List()[0:listnum] {
			if int(job) < thread {
				atomic.AddInt32(&job, 1)
				go fn(id, curGrid, true)
			} else {
				fn(id, curGrid, false)
			}
		}

		for job > 0 {
			time.Sleep(time.Millisecond * 10)
		}

	} else {
		for _, mv := range all.List()[0:listnum] {
			curscore := mv.Score

			tmp := curGrid
			tmp.AddMovPath(brick, mv)
			curtetrisscore := tmp.CalcScore()
			tmp.RemoveFullLine()

			sontetrisscore, sonscore, _ := FindNextStepMaxScoreGame(ai6_score, tmp, start, index+1, total, thread, quick)

			score := curscore + sonscore
			tetrisscore := curtetrisscore + sontetrisscore

			if tetrisscore < curtetrisscore {
				tetrisscore = curtetrisscore
			}

			if tetrisscore >= maxtetrisscore {
				if tetrisscore > maxtetrisscore {
					maxtetrisscore = tetrisscore
					maxscore = score
					maxmv = mv
				} else if tetrisscore == maxtetrisscore {
					if score > maxscore {
						maxscore = score
						maxmv = mv
					}
				}
			}
		}
	}

	return maxtetrisscore, maxscore, maxmv
}

func FindBestPathBySeeNext(ai6_score []float64, N int, step int, thread int, slowfiler float64) {
	var g Grid
	begin := time.Now()
	result := ""
	total := 0
	score := 0
	for index, brick := range gBrick[0:N] {
		_, _, mv := FindNextStepMaxScore(ai6_score, g, index, 0, step, thread, slowfiler)
		if mv.Opl.Empty() {
			loggo.Error("FindNextStepMaxScore fail")
			break
		}
		path := mv.Opl.ToString()
		g.AddMovPath(brick, mv)
		score += g.CalcScore()
		g.RemoveFullLine()
		after := g.Draw()
		stepstr := "N," + path + ","
		result += stepstr
		total = index
		WriteResult(stepstr)

		speed := float64(total) / (float64(time.Now().Sub(begin)) / float64(time.Second))
		lefttime := time.Duration(float64(N-total) / speed * float64(time.Second))
		loggo.Info("cur get \n%v, path %v after\n%vstep:%v, score:%v, speed:%.2f Step/s, left:%v", brick.Draw(),
			path, after, index, score, speed, lefttime)
	}

	result = strings.TrimRight(result, ",")

	WriteResult("\n" + strconv.Itoa(score))

	loggo.Info("result is %v", result)
	loggo.Info("total:%v, score:%v", total, score)
}

func testFind(ai6_score []float64, thread int) {
	step := 6
	{
		var g Grid
		begin := time.Now()
		gamescore, _, mv := FindNextStepMaxScoreGame(ai6_score, g, 0, 0, step, thread, 0.2)
		if mv.Opl.Empty() {
			loggo.Error("testFind fail")
			return
		}
		loggo.Info("FindNextStepMaxScoreGame gamescore is %v", gamescore)
		assert(gamescore, 72)
		loggo.Info("FindNextStepMaxScoreGame time is %v", time.Now().Sub(begin))
	}

	{
		var g Grid
		begin := time.Now()
		_, score, mv := FindNextStepMaxScore(ai6_score, g, 0, 0, step, thread, 0.5)
		if mv.Opl.Empty() {
			loggo.Error("testFind fail")
			return
		}
		loggo.Info("FindNextStepMaxScore score is %v", score)
		assertf(score, -1445.3783244337706)
		loggo.Info("FindNextStepMaxScore time is %v", time.Now().Sub(begin))
	}

	step = 7
	{
		var g Grid
		begin := time.Now()
		gamescore, _, mv := FindNextStepMaxScoreGame(ai6_score, g, 0, 0, step, thread, 0.2)
		if mv.Opl.Empty() {
			loggo.Error("testFind fail")
			return
		}
		loggo.Info("FindNextStepMaxScoreGame gamescore is %v", gamescore)
		assert(gamescore, 84)
		loggo.Info("FindNextStepMaxScoreGame time is %v", time.Now().Sub(begin))
	}

	{
		var g Grid
		begin := time.Now()
		_, score, mv := FindNextStepMaxScore(ai6_score, g, 0, 0, step, thread, 0.5)
		if mv.Opl.Empty() {
			loggo.Error("testFind fail")
			return
		}
		loggo.Info("FindNextStepMaxScore score is %v", score)
		assertf(score, -1676.5621064044685)
		loggo.Info("FindNextStepMaxScore time is %v", time.Now().Sub(begin))
	}

	step = 8
	{
		var g Grid
		begin := time.Now()
		gamescore, _, mv := FindNextStepMaxScoreGame(ai6_score, g, 0, 0, step, thread, 0.2)
		if mv.Opl.Empty() {
			loggo.Error("testFind fail")
			return
		}
		loggo.Info("FindNextStepMaxScoreGame gamescore is %v", gamescore)
		assert(gamescore, 84)
		loggo.Info("FindNextStepMaxScoreGame time is %v", time.Now().Sub(begin))
	}

	{
		var g Grid
		begin := time.Now()
		_, score, mv := FindNextStepMaxScore(ai6_score, g, 0, 0, step, thread, 0.5)
		if mv.Opl.Empty() {
			loggo.Error("testFind fail")
			return
		}
		loggo.Info("FindNextStepMaxScore score is %v", score)
		assertf(score, -1917.5997917590034)
		loggo.Info("FindNextStepMaxScore time is %v", time.Now().Sub(begin))
	}

	step = 12
	{
		var g Grid
		begin := time.Now()
		gamescore, _, mv := FindNextStepMaxScoreGame(ai6_score, g, 0, 0, step, thread, 0.2)
		if mv.Opl.Empty() {
			loggo.Error("testFind fail")
			return
		}
		loggo.Info("FindNextStepMaxScoreGame gamescore is %v", gamescore)
		assert(gamescore, 160)
		loggo.Info("FindNextStepMaxScoreGame time is %v", time.Now().Sub(begin))
	}

	step = 16
	{
		var g Grid
		begin := time.Now()
		gamescore, _, mv := FindNextStepMaxScoreGame(ai6_score, g, 0, 0, step, thread, 0.2)
		if mv.Opl.Empty() {
			loggo.Error("testFind fail")
			return
		}
		loggo.Info("FindNextStepMaxScoreGame gamescore is %v", gamescore)
		assert(gamescore, 288)
		loggo.Info("FindNextStepMaxScoreGame time is %v", time.Now().Sub(begin))
	}

}
