package main

import (
	"github.com/esrrhs/go-engine/src/loggo"
	"strconv"
	"strings"
	"time"
)

func getTotalScores(scores []int) int {
	t := 0
	for _, s := range scores {
		t += s
	}
	return t
}

func BackSearchBestPathByMixSeeNext(ai6_score []float64, N int, step int, quickstep int, thread int, baseheight int, slowfilter float64, quickfilter float64) int {

	allGrid := make([]Grid, N)
	scores := make([]int, N)
	results := make([]string, N)
	quicks := make([]bool, N)
	cur := 0

	backstep := 1

	quickState := true
	total := 0

	recover := false
	recoverindex := 0
	recoverendindex := 0

	maxn := 0

	var base_total int
	var base_totalscore int
	var base_result string
	var base_grid *Grid
	if baseheight > 0 {
		ok, _base_total, _base_totalscore, _base_result, _base_grid := FindBase(ai6_score, N, baseheight)
		if !ok {
			loggo.Error("FindBase fail")
			return 0
		}
		base_total = _base_total
		base_totalscore = _base_totalscore
		base_result = _base_result
		base_grid = _base_grid
	}

	cur = base_total
	minindex := base_total
	if base_grid != nil {
		allGrid[base_total] = *base_grid
	}

	begin := time.Now()

	for {
		index := cur
		brick := gBrick[index]
		g := allGrid[index]

		if recover {
			if index > recoverendindex {
				recover = false
				recoverindex = 0
				recoverendindex = 0
				quickState = true
			}
		}

		var mv MovPath
		if quickState {
			_, _, _mv := FindNextStepMaxScoreGame(ai6_score, g, index, 0, quickstep, thread, quickfilter)
			mv = _mv
		} else {
			_, _, _mv := FindNextStepMaxScore(ai6_score, g, index, 0, step, thread, slowfilter)
			mv = _mv
		}
		if mv.Opl.Empty() {
			if recover {
				recoverindex -= backstep
				if recoverindex < minindex {
					loggo.Error("can not recover %v", minindex)
					return 0
				}
				loggo.Debug("start recover from %v to %v", recoverindex, recoverendindex)
			} else {
				recoverindex = cur - backstep
				recoverendindex = cur
				recover = true
				quickState = false
				loggo.Debug("start recover from %v to %v", recoverindex, recoverendindex)
			}
			cur = recoverindex
			if cur < minindex {
				cur = minindex
			}
			continue
		}
		path := mv.Opl.ToString()
		g.AddMovPath(brick, mv)
		scores[index] = g.CalcScore()
		g.RemoveFullLine()
		stepstr := "N," + path + ","
		results[index] = stepstr
		total = index
		quicks[index] = quickState

		if cur > maxn {
			after := g.Draw()
			maxn = cur
			speed := float64(total) / (float64(time.Now().Sub(begin)) / float64(time.Second))
			lefttime := time.Duration(float64(N-total) / speed * float64(time.Second))
			loggo.Info("cur get \n%v, path %v after\n%vstep:%v, score:%v, finalscore:%v, speed:%.2f Step/s, left:%v, quick:%v, recover:%v", brick.Draw(),
				path, after, index, getTotalScores(scores[0:total+1]), getTotalScores(scores[0:total+1])*N/index, speed, lefttime, quickState, recover)
		}

		cur++
		if cur >= N {
			break
		}
		allGrid[cur] = g
	}

	totalquick := 0
	for _, b := range quicks[base_total:] {
		if b {
			totalquick++
		}
	}

	totalscore := getTotalScores(scores[base_total : total+1])

	result := strings.Join(results[base_total:total+1], "")
	result = strings.TrimRight(result, ",")
	result = base_result + "," + result
	totalscore += base_totalscore

	WriteResult(result)
	WriteResult("\n" + strconv.Itoa(totalscore) + "\n")

	loggo.Info("result is %v", result)
	loggo.Info("total:%v, totalquick:%v, score:%v, usetime:%v", total, totalquick, totalscore, time.Now().Sub(begin))

	return totalscore
}
