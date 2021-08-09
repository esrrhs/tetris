package main

import (
	"github.com/esrrhs/go-engine/src/loggo"
	"math"
	"strconv"
	"strings"
)

func FindBestScorePath(ai6_score []float64, g Grid, brick Brick) (string, MovPath) {
	all := g.findAllMovPath(brick)
	if all.Len() <= 0 {
		return "none", MovPath{}
	}

	max := float64(math.MinInt32)
	maxpath := "none"
	var dstmv MovPath
	for _, mv := range all.List() {
		score := g.CalcBrickScore(brick, mv, ai6_score)
		if score > max {
			max = score
			maxpath = mv.Opl.ToString()
			dstmv = mv
		}
	}

	if maxpath == "none" {
		loggo.Error("find max score fail")
		return "none", MovPath{}
	}

	return maxpath, dstmv
}

func FindBestPathByOneStepScore(ai6_score []float64, N int) {
	var g Grid
	result := ""
	total := 0
	score := 0
	for index, brick := range gBrick[0:N] {
		path, mv := FindBestScorePath(ai6_score, g, brick)
		if path == "none" {
			break
		}
		g.AddMovPath(brick, mv)
		score += g.CalcScore()
		g.RemoveFullLine()
		after := g.Draw()
		stepstr := "N," + path + ","
		result += stepstr
		total = index
		WriteResult(stepstr)
		loggo.Info("cur step is %v, get \n%v, path %v after\n%v", index, brick.Draw(), path, after)
	}

	result = strings.TrimRight(result, ",")

	WriteResult("\n" + strconv.Itoa(score))

	loggo.Info("result is %v", result)
	loggo.Info("total:%v, score:%v", total, score)
}
