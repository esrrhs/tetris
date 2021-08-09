package main

import (
	"github.com/esrrhs/go-engine/src/loggo"
	"math"
	"os"
	"strconv"
)

type Point struct {
	X int
	Y int
}

const (
	// I,L,J,T,O,S,Z
	Shape_I   = 0
	Shape_L   = 1
	Shape_J   = 2
	Shape_T   = 3
	Shape_O   = 4
	Shape_S   = 5
	Shape_Z   = 6
	Shape_MAX = 7

	MaxRow = 20
	MaxCol = 10
)

func TypeToName(ty int) string {
	switch ty {
	case Shape_I:
		return "I"
	case Shape_L:
		return "L"
	case Shape_J:
		return "J"
	case Shape_T:
		return "T"
	case Shape_O:
		return "O"
	case Shape_S:
		return "S"
	case Shape_Z:
		return "Z"
	}
	return "ERR " + strconv.Itoa(ty)
}

var shapes = [][][]Point{
	{
		// I 型
		{
			{0, 0},
			{0, -1},
			{0, -2},
			{0, 1},
		},
		{
			{0, 0},
			{1, 0},
			{2, 0},
			{-1, 0},
		},
		{
			{0, 0},
			{0, -1},
			{0, -2},
			{0, 1},
		},
		{
			{0, 0},
			{1, 0},
			{2, 0},
			{-1, 0},
		},
	},
	{
		// L 型
		{
			{0, 0},
			{0, -1},
			{0, -2},
			{1, 0},
		},
		{
			{0, 0},
			{1, 0},
			{2, 0},
			{0, 1},
		},
		{
			{0, 0},
			{-1, 0},
			{0, 1},
			{0, 2},
		},
		{
			{0, 0},
			{0, -1},
			{-1, 0},
			{-2, 0},
		},
	},
	{
		// J 型
		{
			{0, 0},
			{0, -1},
			{0, -2},
			{-1, 0},
		},
		{
			{0, 0},
			{0, -1},
			{1, 0},
			{2, 0},
		},
		{
			{0, 0},
			{1, 0},
			{0, 1},
			{0, 2},
		},
		{
			{0, 0},
			{-1, 0},
			{-2, 0},
			{0, 1},
		},
	},
	{
		// T 型
		{
			{0, 0},
			{1, 0},
			{0, 1},
			{-1, 0},
		},
		{
			{0, 0},
			{0, -1},
			{0, 1},
			{-1, 0},
		},
		{
			{0, 0},
			{0, -1},
			{1, 0},
			{-1, 0},
		},
		{
			{0, 0},
			{0, -1},
			{1, 0},
			{0, 1},
		},
	},
	{
		// O 型
		{
			{0, 0},
			{0, -1},
			{1, -1},
			{1, 0},
		},
		{
			{0, 0},
			{0, -1},
			{1, -1},
			{1, 0},
		},
		{
			{0, 0},
			{0, -1},
			{1, -1},
			{1, 0},
		},
		{
			{0, 0},
			{0, -1},
			{1, -1},
			{1, 0},
		},
	},
	{
		// S 型
		{
			{0, 0},
			{0, -1},
			{1, -1},
			{-1, 0},
		},
		{
			{0, 0},
			{-1, 0},
			{-1, -1},
			{0, 1},
		},
		{
			{0, 0},
			{0, -1},
			{1, -1},
			{-1, 0},
		},
		{
			{0, 0},
			{-1, 0},
			{-1, -1},
			{0, 1},
		},
	},
	{
		// Z 型
		{
			{0, 0},
			{0, -1},
			{1, 0},
			{-1, -1},
		},
		{
			{0, 0},
			{0, -1},
			{-1, 1},
			{-1, 0},
		},
		{
			{0, 0},
			{0, -1},
			{1, 0},
			{-1, -1},
		},
		{
			{0, 0},
			{0, -1},
			{-1, 1},
			{-1, 0},
		},
	},
}

// https://github.com/ielashi/eltetris
var ai6_score_LandingHeight = -4.500158825082766
var ai6_score_Rowseliminated = 3.4181268101392694
var ai6_score_RowTransitions = -3.2178882868487753
var ai6_score_ColumnTransitions = -9.348695305445199
var ai6_score_NumberofHoles = -7.899265427351652
var ai6_score_WellSums = -3.3855972247263626

var ai6_score_LandingHeight_find = -5.500158825082766
var ai6_score_Rowseliminated_find = 3.4181268101392694
var ai6_score_RowTransitions_find = -3.2178882868487753
var ai6_score_ColumnTransitions_find = -9.348695305445199
var ai6_score_NumberofHoles_find = -7.899265427351652
var ai6_score_WellSums_find = -3.3855972247263626

var AI6_SCORE []float64
var AI6_SCORE_FIND []float64

const (
	LandingHeight     = 0
	Rowseliminated    = 1
	RowTransitions    = 2
	ColumnTransitions = 3
	NumberofHoles     = 3
	WellSums          = 4
)

var gResultFile *os.File

func OpenResultFile() {
	// open output file
	fo, err := os.Create("result.txt")
	if err != nil {
		loggo.Error("open file fail %v", err)
		return
	}
	gResultFile = fo
}

func WriteResult(str string) {
	_, err := gResultFile.WriteString(str)
	if err != nil {
		loggo.Error("write file fail %v", err)
		return
	}
}

var gShapesDown [Shape_MAX][4][]Point
var gShapesDownMax [Shape_MAX][4]Point
var gShapesUpMax [Shape_MAX][4]Point
var gShapesHeight [Shape_MAX][4]int
var gShapesTransNum [Shape_MAX]int

var gGridRowTransitionsCache []int
var gGridColTransitionsCache []int
var gGridRowFullKey int
var gGridRowEmptyKey int
var gGridColHeightCache []int
var gGridColHoleCache []int
var gGridColNumCache []int
var gGridRowWellCache [][]int
var gGridColWellCache [][]int

func build_shape() {
	AI6_SCORE = []float64{
		ai6_score_LandingHeight,
		ai6_score_Rowseliminated,
		ai6_score_RowTransitions,
		ai6_score_ColumnTransitions,
		ai6_score_NumberofHoles,
		ai6_score_WellSums,
	}

	AI6_SCORE_FIND = []float64{
		ai6_score_LandingHeight_find,
		ai6_score_Rowseliminated_find,
		ai6_score_RowTransitions_find,
		ai6_score_ColumnTransitions_find,
		ai6_score_NumberofHoles_find,
		ai6_score_WellSums_find,
	}

	for ty, info := range shapes {
		for state, ps := range info {
			var downp []Point
			for _, p := range ps {
				find := false
				for _, dp := range downp {
					if dp.X == p.X {
						if dp.Y < p.Y {
							dp.Y = p.Y
						}
						find = true
					}
				}
				if !find {
					downp = append(downp, p)
				}
			}
			gShapesDown[ty][state] = downp
		}
	}

	for ty, info := range shapes {
		for state, ps := range info {
			for _, p := range ps {
				if p.Y > gShapesDownMax[ty][state].Y {
					gShapesDownMax[ty][state].X = p.X
					gShapesDownMax[ty][state].Y = p.Y
				}
			}
		}
	}

	for ty, info := range shapes {
		for state, ps := range info {
			gShapesUpMax[ty][state].Y = math.MaxInt32
			for _, p := range ps {
				if p.Y < gShapesUpMax[ty][state].Y {
					gShapesUpMax[ty][state].X = p.X
					gShapesUpMax[ty][state].Y = p.Y
				}
			}
		}
	}

	for ty, info := range shapes {
		for state, ps := range info {
			m := make(map[int]int)
			for _, p := range ps {
				m[p.Y]++
			}
			gShapesHeight[ty][state] = len(m)
		}
	}

	for ty, info := range shapes {
		m := make(map[string]int)
		for _, ps := range info {
			s := ""
			for _, p := range ps {
				s += strconv.Itoa(p.X) + "," + strconv.Itoa(p.Y) + ","
			}
			m[s]++
		}
		gShapesTransNum[ty] = len(m)
	}
}

func assert(left int, right int) {
	if left != right {
		loggo.Error("diff %v != %v", left, right)
	}
}

func asserts(left string, right string) {
	if left != right {
		loggo.Error("diff %v != %v", left, right)
	}
}

func assertf(left float64, right float64) {
	if left != right {
		loggo.Error("diff %v != %v", left, right)
	}
}
func assertb(left bool) {
	if !left {
		loggo.Error("diff %v != true", left)
	}
}
func make_line(result *[][]bool, line []bool, total int, cur int) {
	if cur == total {
		tmp := make([]bool, 0)
		for _, l := range line {
			tmp = append(tmp, l)
		}
		*result = append(*result, tmp)
		return
	}

	line[cur] = true
	make_line(result, line, total, cur+1)

	line[cur] = false
	make_line(result, line, total, cur+1)
}

func make_line_key(in []bool) int {
	ret := 0
	for index, b := range in {
		if b {
			ret |= 1 << index
		}
	}
	return ret
}

func build_grid() {
	{
		var row_genresult [][]bool
		row_line := make([]bool, MaxCol)
		make_line(&row_genresult, row_line, MaxCol, 0)
		gGridRowTransitionsCache = make([]int, len(row_genresult))
		for _, line := range row_genresult {
			key := make_line_key(line)
			gGridRowTransitionsCache[key] = getSingleRowTransitions(line)
		}
	}

	{
		var col_genresult [][]bool
		col_line := make([]bool, MaxRow)
		make_line(&col_genresult, col_line, MaxRow, 0)
		gGridColTransitionsCache = make([]int, len(col_genresult))
		for _, line := range col_genresult {
			key := make_line_key(line)
			gGridColTransitionsCache[key] = getSingleColumnTransitions(line)
		}
	}

	{
		full := make([]bool, MaxCol)
		gGridRowEmptyKey = make_line_key(full)
		for i := range full {
			full[i] = true
		}
		gGridRowFullKey = make_line_key(full)
	}

	{
		var col_genresult [][]bool
		col_line := make([]bool, MaxRow)
		make_line(&col_genresult, col_line, MaxRow, 0)
		gGridColHeightCache = make([]int, len(col_genresult))
		for _, line := range col_genresult {
			key := make_line_key(line)
			gGridColHeightCache[key] = getSingleColumnHeight(line)
		}
	}

	{
		var col_genresult [][]bool
		col_line := make([]bool, MaxRow)
		make_line(&col_genresult, col_line, MaxRow, 0)
		gGridColHoleCache = make([]int, len(col_genresult))
		for _, line := range col_genresult {
			key := make_line_key(line)
			gGridColHoleCache[key] = getSingleColumnHole(line)
		}
	}

	{
		var col_genresult [][]bool
		col_line := make([]bool, MaxRow)
		make_line(&col_genresult, col_line, MaxRow, 0)
		gGridColNumCache = make([]int, len(col_genresult))
		for _, line := range col_genresult {
			key := make_line_key(line)
			gGridColNumCache[key] = getSingleColumnNum(line)
		}
	}

	{
		var row_genresult [][]bool
		row_line := make([]bool, MaxCol)
		make_line(&row_genresult, row_line, MaxCol, 0)
		gGridRowWellCache = make([][]int, len(row_genresult))
		for _, line := range row_genresult {
			key := make_line_key(line)
			gGridRowWellCache[key] = getSingleRowWell(line)
		}
	}

	{
		var col_genresult [][]bool
		col_line := make([]bool, MaxRow)
		make_line(&col_genresult, col_line, MaxRow, 0)
		gGridColWellCache = make([][]int, len(col_genresult))
		for _, line := range col_genresult {
			key := make_line_key(line)
			gGridColWellCache[key] = make([]int, MaxRow)
			for r := 0; r < MaxRow; r++ {
				gGridColWellCache[key][r] = getSingleColumnWellNum(line, r)
			}
		}
	}

}

func init() {
	build_shape()
	build_grid()
}
