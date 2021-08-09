package main

import (
	"github.com/esrrhs/go-engine/src/common"
	"github.com/esrrhs/go-engine/src/loggo"
)

type Grid struct {
	area    [MaxCol][MaxRow]bool
	colline [MaxCol]int
	rowline [MaxRow]int
}

func (g *Grid) Clear() {
	for i := 0; i < MaxCol; i++ {
		for j := 0; j < MaxRow; j++ {
			g.area[i][j] = false
		}
	}
	for i := 0; i < MaxCol; i++ {
		g.colline[i] = 0
	}
	for i := 0; i < MaxRow; i++ {
		g.rowline[i] = 0
	}
}

func (g *Grid) Has(x int, y int) bool {
	return g.area[x][y]
}

func (g *Grid) Set(x int, y int) {
	g.area[x][y] = true
	g.colline[x] |= 1 << y
	g.rowline[y] |= 1 << x
}

func (g *Grid) updateLine() {
	for i := 0; i < MaxCol; i++ {
		g.colline[i] = 0
	}
	for i := 0; i < MaxRow; i++ {
		g.rowline[i] = 0
	}
	for i := 0; i < MaxCol; i++ {
		for j := 0; j < MaxRow; j++ {
			if g.area[i][j] {
				g.colline[i] |= 1 << j
				g.rowline[j] |= 1 << i
			}
		}
	}
}

func (g *Grid) AddMovPath(brick Brick, mv MovPath) {
	cur := brick
	cur.Stat = mv.Stat
	g.AddBrick(cur, mv.Dst)
}

func (g *Grid) AddBrick(brick Brick, curpos Point) {
	ps := shapes[brick.Ty][brick.Stat]
	for _, p := range ps {
		x := p.X + curpos.X
		y := p.Y + curpos.Y
		if y >= 0 {
			g.area[x][y] = true
			g.colline[x] |= 1 << y
			g.rowline[y] |= 1 << x
		}
	}
}

func (g *Grid) DelBrick(brick Brick, curpos Point) {
	ps := shapes[brick.Ty][brick.Stat]
	for _, p := range ps {
		x := p.X + curpos.X
		y := p.Y + curpos.Y
		if y >= 0 {
			g.area[x][y] = false
			g.colline[x] &= ^(1 << y)
			g.rowline[y] &= ^(1 << x)
		}
	}
}

func (g *Grid) CalcBrickScore(brick Brick, mv MovPath, ai6_score []float64) float64 {
	cur := brick
	cur.Stat = mv.Stat
	g.AddBrick(cur, mv.Dst)
	defer g.DelBrick(cur, mv.Dst)
	score := g.calcGridScore(brick, mv, ai6_score)
	return score
}

func (g *Grid) calcGridScore(brick Brick, mv MovPath, ai6_score []float64) float64 {
	return g.calcGridScore6Param(brick, mv, ai6_score)
}

func (g *Grid) calcGridScore6Param(brick Brick, mv MovPath, ai6_score []float64) float64 {
	fullline := float64(g.GetFullLine())
	hole := float64(g.GetHole(true))
	landingHeight := g.GetLandingHeight(brick, mv)
	rowTrans := float64(g.GetRowTransitions(true))
	colTrans := float64(g.GetColumnTransitions(true))
	wellsums := float64(g.GetWellSums(true))

	score := landingHeight*ai6_score[LandingHeight] + fullline*ai6_score[Rowseliminated] +
		rowTrans*ai6_score[RowTransitions] + colTrans*ai6_score[ColumnTransitions] +
		hole*ai6_score[NumberofHoles] + wellsums*ai6_score[WellSums]

	return score
}

func (g *Grid) CheckValid(brick Brick, curpos Point) bool {
	ps := shapes[brick.Ty][brick.Stat]
	for _, p := range ps {
		x := p.X + curpos.X
		y := p.Y + curpos.Y
		if x < 0 || x >= MaxCol || y >= MaxRow || (y >= 0 && g.area[x][y]) {
			return false
		}
	}
	return true
}

func (g *Grid) GetFullLine() int {
	n := 0
	for i := 0; i < MaxRow; i++ {
		if g.rowline[i] == gGridRowFullKey {
			n++
		}
	}
	return n
}

func getSingleColumnHole(area []bool) int {
	n := 0
	first := -1
	for j := 0; j < MaxRow; j++ {
		if area[j] {
			first = j
			break
		}
	}
	if first >= 0 {
		for j := first; j < MaxRow; j++ {
			if !area[j] {
				n++
			}
		}
	}
	return n
}

func (g *Grid) GetHole(quick bool) int {
	if quick {
		n := 0
		for i := 0; i < MaxCol; i++ {
			n += gGridColHoleCache[g.colline[i]]
		}
		return n
	}

	n := 0
	for i := 0; i < MaxCol; i++ {
		first := -1
		for j := 0; j < MaxRow; j++ {
			if g.area[i][j] {
				first = j
				break
			}
		}
		if first >= 0 {
			for j := first; j < MaxRow; j++ {
				if !g.area[i][j] {
					n++
				}
			}
		}
	}
	return n
}

func (g *Grid) IsBottomMoreThanOneHole(rownum int) bool {
	var holenum [MaxRow]int
	for i := 0; i < MaxCol; i++ {
		first := -1
		for j := 0; j < MaxRow; j++ {
			if g.area[i][j] {
				first = j
				break
			}
		}
		if first >= 0 {
			for j := first; j < MaxRow; j++ {
				if !g.area[i][j] {
					holenum[j]++
				}
			}
		}
	}
	for j := MaxRow - rownum; j < MaxRow; j++ {
		if holenum[j] > 1 {
			return true
		}
	}
	return false
}

func (g *Grid) IsFullExceptOneHole(row int) bool {
	n := 0
	var holecol int
	for i := 0; i < MaxCol; i++ {
		if !g.area[i][row] {
			n++
			holecol = i
		}
	}
	if n != 1 {
		return false
	}

	has := false
	for j := row - 1; j >= 0; j-- {
		if g.area[holecol][j] {
			has = true
			break
		}
	}
	if !has {
		return false
	}
	return true
}

func (g *Grid) GetMaxHeight(quick bool) int {
	max := 0
	for i := 0; i < MaxCol; i++ {
		height := g.GetColumnHeight(i, quick)
		if height > max {
			max = height
		}
	}
	return max
}

func (g *Grid) CalcScore() int {
	line := g.GetFullLine()
	num := g.GetNum(true)
	score := []int{0, 1, 3, 6, 10}
	return num * score[line]
}

func (g *Grid) RemoveFullLine() {
	has := false
	for i := 0; i < MaxRow; i++ {
		if g.rowline[i] == gGridRowFullKey {
			has = true
			for j := 0; j < MaxCol; j++ {
				for z := i; z > 0; z-- {
					g.area[j][z] = g.area[j][z-1]
				}
				g.area[j][0] = false
			}
		}
	}

	if has {
		g.updateLine()
	}
}

func (g *Grid) Draw() string {
	str := ""
	for i := 0; i < MaxRow; i++ {
		for j := 0; j < MaxCol; j++ {
			if g.area[j][i] {
				str += "*"
			} else {
				str += "."
			}
		}
		str += "\n"
	}
	return str
}

func getSingleColumnNum(area []bool) int {
	n := 0
	for i := 0; i < MaxRow; i++ {
		if area[i] {
			n++
		}
	}
	return n
}

func (g *Grid) GetNum(quick bool) int {
	if quick {
		n := 0
		for i := 0; i < MaxCol; i++ {
			n += gGridColNumCache[g.colline[i]]
		}
		return n
	}
	n := 0
	for i := 0; i < MaxRow; i++ {
		for j := 0; j < MaxCol; j++ {
			if g.area[j][i] {
				n++
			}
		}
	}
	return n
}

func (g *Grid) GetAggregateHeight(quick bool) int {
	total := 0
	for c := 0; c < MaxCol; c++ {
		total += g.GetColumnHeight(c, quick)
	}
	return total
}

func getSingleColumnHeight(area []bool) int {
	first := -1
	for j := 0; j < MaxRow; j++ {
		if area[j] {
			first = j
			break
		}
	}
	if first >= 0 {
		return MaxRow - first
	}
	return 0
}

func (g *Grid) GetColumnHeight(col int, quick bool) int {
	if quick {
		return gGridColHeightCache[g.colline[col]]
	}

	first := -1
	for j := 0; j < MaxRow; j++ {
		if g.area[col][j] {
			first = j
			break
		}
	}
	if first >= 0 {
		return MaxRow - first
	}
	return 0
}

func (g *Grid) GetBumpiness(quick bool) int {
	total := 0
	for c := 0; c < MaxCol-1; c++ {
		total += common.AbsInt(g.GetColumnHeight(c, quick) - g.GetColumnHeight(c+1, quick))
	}
	return total
}

func (g *Grid) findMovPath(brick Brick, curpos Point, walkGrid *Grid, opl *OpList, ret *MovPathList, stat int) {

	if !(curpos.X >= 0 && curpos.X < MaxCol && curpos.Y >= 0 && curpos.Y < MaxRow) || walkGrid.area[curpos.X][curpos.Y] {
		return
	}
	walkGrid.area[curpos.X][curpos.Y] = true

	// CheckValid
	ps := shapes[brick.Ty][brick.Stat]
	for _, p := range ps {
		x := p.X + curpos.X
		y := p.Y + curpos.Y
		if x < 0 || x >= MaxCol || y >= MaxRow || (y >= 0 && g.area[x][y]) {
			return
		}
	}

	// checkIsFly
	isFly := true
	downp := gShapesDown[brick.Ty][brick.Stat]
	for _, p := range downp {
		x := p.X + curpos.X
		y := p.Y + curpos.Y
		if y < MaxRow-1 {
			if g.area[x][y+1] {
				isFly = false
				break
			}
		} else {
			isFly = false
			break
		}
	}

	if !isFly && !g.checkEnd(brick, curpos) {
		ret.Add(MovPath{curpos, opl.Copy(), stat, 0})
	}

	{
		newpos := curpos
		newpos.Y++
		opl.Add(OP_D)
		g.findMovPath(brick, newpos, walkGrid, opl, ret, stat)
		opl.Pop()
	}

	{
		newpos := curpos
		newpos.X--
		opl.Add(OP_L)
		g.findMovPath(brick, newpos, walkGrid, opl, ret, stat)
		opl.Pop()
	}

	{
		newpos := curpos
		newpos.X++
		opl.Add(OP_R)
		g.findMovPath(brick, newpos, walkGrid, opl, ret, stat)
		opl.Pop()
	}
}

func (g *Grid) findAllMovPath(brick Brick) *MovPathList {

	var ret MovPathList

	var ol OpList

	var born Point
	born.X = 4
	born.Y = 0

	cur := brick

	transnum := gShapesTransNum[brick.Ty]

	for i := 0; i < transnum; i++ {
		if i > 0 {
			cur.Stat++
			if cur.Stat >= 4 {
				cur.Stat = 0
			}
			ol.Add(OP_C)
		}

		if !g.CheckValid(cur, born) {
			break
		}

		var walkGrid Grid

		g.findMovPath(cur, born, &walkGrid, &ol, &ret, cur.Stat)
	}

	return &ret
}

func (g *Grid) checkIsFly(brick Brick, dst Point) bool {
	downp := gShapesDown[brick.Ty][brick.Stat]
	for _, p := range downp {
		x := p.X + dst.X
		y := p.Y + dst.Y
		if y < MaxRow-1 {
			if g.area[x][y+1] {
				return false
			}
		} else {
			return false
		}
	}
	return true
}

func (g *Grid) checkIsPartFlyMv(brick Brick, mv MovPath) bool {
	cur := brick
	cur.Stat = mv.Stat
	p := mv.Dst
	return g.checkIsPartFly(cur, p)
}

func (g *Grid) checkIsPartFly(brick Brick, dst Point) bool {
	downp := gShapesDown[brick.Ty][brick.Stat]
	for _, p := range downp {
		x := p.X + dst.X
		y := p.Y + dst.Y
		if y < MaxRow-1 {
			if !g.area[x][y+1] {
				return true
			}
		}
	}
	return false
}

func (g *Grid) checkEnd(brick Brick, dst Point) bool {
	upp := gShapesUpMax[brick.Ty][brick.Stat]
	y := upp.Y + dst.Y
	if y <= 0 {
		return true
	}
	return false
}

func (g *Grid) GetLandingHeight(brick Brick, mv MovPath) float64 {
	cur := brick
	cur.Stat = mv.Stat
	p := mv.Dst
	downp := gShapesDownMax[cur.Ty][cur.Stat]
	y := p.Y + downp.Y
	landing_height := MaxRow - y - 1
	brick_height := float64(gShapesHeight[cur.Ty][cur.Stat]-1) / 2
	return float64(landing_height) + brick_height
}

func getSingleRowTransitions(area []bool) int {
	n := 0
	last := true
	for j := 0; j < MaxCol; j++ {
		if (area[j] && !last) || (!area[j] && last) {
			n++
		}
		last = area[j]
	}
	if !area[MaxCol-1] {
		n++
	}
	return n
}

func (g *Grid) GetRowTransitions(quick bool) int {
	if quick {
		n := 0
		for i := 0; i < MaxRow; i++ {
			n += gGridRowTransitionsCache[g.rowline[i]]
		}
		return n
	}

	n := 0
	last := true
	for i := 0; i < MaxRow; i++ {
		for j := 0; j < MaxCol; j++ {
			if (g.area[j][i] && !last) || (!g.area[j][i] && last) {
				n++
			}
			last = g.area[j][i]
		}
		if !g.area[MaxCol-1][i] {
			n++
		}
		last = true
	}
	return n
}

func getSingleColumnTransitions(area []bool) int {
	n := 0
	last := true
	for j := MaxRow - 1; j >= 0; j-- {
		if (area[j] && !last) || (!area[j] && last) {
			n++
		}
		last = area[j]
	}
	return n
}

func (g *Grid) GetColumnTransitions(quick bool) int {
	if quick {
		n := 0
		for i := 0; i < MaxCol; i++ {
			n += gGridColTransitionsCache[g.colline[i]]
		}
		return n
	}

	n := 0
	last := true
	for i := 0; i < MaxCol; i++ {
		for j := MaxRow - 1; j >= 0; j-- {
			if (g.area[i][j] && !last) || (!g.area[i][j] && last) {
				n++
			}
			last = g.area[i][j]
		}
		last = true
	}
	return n
}

func getSingleRowWell(area []bool) []int {
	ret := make([]int, 0)
	for i := 0; i < MaxCol; i++ {
		if !area[i] &&
			(i <= 0 || (i > 0 && area[i-1])) &&
			(i >= MaxCol-1 || (i < MaxCol-1 && area[i+1])) {
			ret = append(ret, i)
		}
	}
	return ret
}

func getSingleColumnWellNum(area []bool, r int) int {
	n := 1
	for k := r + 1; k < MaxRow; k++ {
		if !area[k] {
			n++
		} else {
			break
		}
	}
	return n
}

func (g *Grid) GetWellSums(quick bool) int {
	if quick {
		n := 0
		for j := 0; j < MaxRow; j++ {
			for _, i := range gGridRowWellCache[g.rowline[j]] {
				n += gGridColWellCache[g.colline[i]][j]
			}
		}
		return n
	}

	n := 0
	for i := 0; i < MaxCol; i++ {
		for j := 0; j < MaxRow; j++ {
			if !g.area[i][j] &&
				(i <= 0 || (i > 0 && g.area[i-1][j])) &&
				(i >= MaxCol-1 || (i < MaxCol-1 && g.area[i+1][j])) {
				n++
				for k := j + 1; k < MaxRow; k++ {
					if !g.area[i][k] {
						n++
					} else {
						break
					}
				}
			}
		}
	}
	return n
}

func (g *Grid) GetMaxWellHeight() int {
	max := 0
	for i := 0; i < MaxCol; i++ {
		for j := 0; j < MaxRow; j++ {
			if !g.area[i][j] &&
				(i <= 0 || (i > 0 && g.area[i-1][j])) &&
				(i >= MaxCol-1 || (i < MaxCol-1 && g.area[i+1][j])) {
				n := 1
				for k := j + 1; k < MaxRow; k++ {
					if !g.area[i][k] {
						n++
					} else {
						break
					}
				}
				if n > max {
					max = n
				}
			}
		}
	}
	return max
}

func testGrid() {
	g := Grid{}
	g.Clear()
	g.area[0][19] = true
	g.area[1][19] = true
	g.area[1][18] = true
	g.area[5][19] = true
	loggo.Info("GetAggregateHeight %v", g.GetAggregateHeight(false))
	assert(g.GetAggregateHeight(false), 4)

	g.Clear()
	g.area[0][19] = true
	g.area[1][19] = true
	g.area[1][18] = true
	g.area[2][18] = true
	g.area[3][18] = true
	g.area[4][18] = true
	g.area[5][18] = true
	g.area[5][19] = true
	g.updateLine()
	loggo.Info("GetHole %v", g.GetHole(true))
	assert(g.GetHole(true), 3)
	assert(g.GetHole(false), 3)

	g.Clear()
	g.area[0][19] = true
	g.area[1][19] = true
	g.area[2][19] = true
	g.area[2][18] = true
	g.area[3][19] = true
	g.area[4][19] = true
	g.area[5][18] = true
	g.area[5][19] = true
	g.area[6][19] = true
	g.area[7][19] = true
	g.area[8][19] = true
	g.area[9][19] = true
	g.area[0][9] = true
	g.area[1][9] = true
	g.area[2][9] = true
	g.area[2][8] = true
	g.area[3][9] = true
	g.area[4][9] = true
	g.area[5][8] = true
	g.area[5][9] = true
	g.area[6][9] = true
	g.area[7][9] = true
	g.area[8][9] = true
	g.area[9][9] = true
	g.updateLine()
	loggo.Info("GetFullLine %v", g.GetFullLine())
	assert(g.GetFullLine(), 2)

	g.Clear()
	g.area[0][19] = true
	g.area[1][19] = true
	g.area[1][18] = true
	g.area[2][19] = true
	g.area[3][19] = true
	g.area[4][19] = true
	g.area[5][18] = true
	g.area[5][19] = true
	loggo.Info("GetBumpiness %v", g.GetBumpiness(false))
	assert(g.GetBumpiness(false), 5)

	g.Clear()
	brick := Brick{}
	brick.Ty = 0
	brick.Stat = 1
	mv := MovPath{}
	mv.Stat = 0
	mv.Dst.X = 1
	mv.Dst.Y = 17
	loggo.Info("GetLandingHeight %v", g.GetLandingHeight(brick, mv))
	assertf(g.GetLandingHeight(brick, mv), 2.5)

	g.Clear()
	g.area[0][18] = true
	g.area[0][19] = true
	loggo.Info("GetRowTransitions %v", g.GetRowTransitions(false))
	assert(g.GetRowTransitions(false), 40)

	g.Clear()
	g.area[0][19] = true
	g.area[1][19] = true
	g.area[1][18] = true
	g.area[1][17] = true
	loggo.Info("GetRowTransitions %v", g.GetRowTransitions(false))
	assert(g.GetRowTransitions(false), 44)

	g.Clear()
	g.area[0][18] = true
	g.area[1][18] = true
	g.area[1][19] = true
	g.area[9][18] = true
	g.area[9][19] = true
	loggo.Info("GetRowTransitions %v", g.GetRowTransitions(false))
	assert(g.GetRowTransitions(false), 42)

	g.Clear()
	g.area[1][18] = true
	g.area[1][19] = true
	loggo.Info("GetRowTransitions %v", g.GetRowTransitions(false))
	assert(g.GetRowTransitions(false), 44)

	g.Clear()
	loggo.Info("GetColumnTransitions %v", g.GetColumnTransitions(false))
	assert(g.GetColumnTransitions(false), 10)

	g.Clear()
	g.area[0][19] = true
	g.area[1][19] = true
	g.area[1][18] = true
	g.area[9][19] = true
	loggo.Info("GetColumnTransitions %v", g.GetColumnTransitions(false))
	assert(g.GetColumnTransitions(false), 10)

	g.Clear()
	g.area[0][19] = true
	g.area[0][18] = true
	g.area[1][18] = true
	g.area[2][18] = true
	g.area[2][19] = true
	loggo.Info("GetColumnTransitions %v", g.GetColumnTransitions(false))
	assert(g.GetColumnTransitions(false), 12)

	g.Clear()
	var col_genresult [][]bool
	col_line := make([]bool, MaxRow)
	make_line(&col_genresult, col_line, MaxRow, 0)
	index := 0
	for i := 0; i < len(col_genresult); i++ {
		for j, p := range col_genresult[i] {
			g.area[index][j] = p
		}
		g.colline[index] = make_line_key(col_genresult[i])
		index++
		if index >= MaxCol {
			assert(g.GetColumnTransitions(true), g.GetColumnTransitions(false))
			index = 0
		}
	}

	g.Clear()
	var row_genresult [][]bool
	row_line := make([]bool, MaxCol)
	make_line(&row_genresult, row_line, MaxCol, 0)
	index = 0
	for i := 0; i < len(row_genresult); i++ {
		for j, p := range row_genresult[i] {
			g.area[j][index] = p
		}
		g.rowline[index] = make_line_key(row_genresult[i])
		index++
		if index >= MaxRow {
			assert(g.GetRowTransitions(true), g.GetRowTransitions(false))
			index = 0
		}
	}

	g.Clear()
	g.area[0][19] = true
	g.area[0][18] = true
	g.area[1][19] = true
	g.area[2][18] = true
	g.area[2][19] = true
	g.updateLine()
	loggo.Info("GetWellSums %v", g.GetWellSums(true))
	assert(g.GetWellSums(true), 1)
	assert(g.GetWellSums(false), 1)

	g.Clear()
	g.area[0][19] = true
	g.area[0][18] = true
	g.area[1][19] = true
	g.area[2][18] = true
	g.area[2][19] = true
	g.area[4][19] = true
	g.updateLine()
	loggo.Info("GetWellSums %v", g.GetWellSums(true))
	assert(g.GetWellSums(true), 2)
	assert(g.GetWellSums(false), 2)

	g.Clear()
	g.area[0][19] = true
	g.area[0][18] = true
	g.area[1][19] = true
	g.area[2][18] = true
	g.area[2][19] = true
	g.area[4][19] = true
	g.area[8][19] = true
	g.updateLine()
	loggo.Info("GetWellSums %v", g.GetWellSums(true))
	assert(g.GetWellSums(true), 3)
	assert(g.GetWellSums(false), 3)

	g.Clear()
	g.area[0][19] = true
	g.area[0][18] = true
	g.area[1][19] = true
	g.area[2][18] = true
	g.area[2][19] = true
	g.area[4][19] = true
	g.area[8][16] = true
	g.area[8][17] = true
	g.area[8][18] = true
	g.area[8][19] = true
	g.updateLine()
	loggo.Info("GetWellSums %v", g.GetWellSums(true))
	assert(g.GetWellSums(true), 1+1+1+2+3+4)
	assert(g.GetWellSums(false), 1+1+1+2+3+4)

	g.Clear()
	g.area[0][18] = true
	g.area[1][18] = true
	g.area[2][18] = true
	g.area[3][18] = true
	g.area[4][18] = true
	g.area[5][18] = true
	g.area[6][18] = false
	g.area[7][18] = false
	g.area[8][18] = true
	g.area[9][18] = true
	g.area[0][19] = true
	g.area[1][19] = false
	g.area[2][19] = true
	g.area[3][19] = true
	g.area[4][19] = true
	g.area[5][19] = true
	g.area[6][19] = false
	g.area[7][19] = true
	g.area[8][19] = true
	g.area[9][19] = false
	loggo.Info("IsBottomMoreThanOneHole %v", g.IsBottomMoreThanOneHole(2))
	assertb(g.IsBottomMoreThanOneHole(2))

	g.Clear()
	loggo.Info("checkIsFly %v", g.checkIsFly(Brick{0, 1}, Point{4, 18}))
	assertb(g.checkIsFly(Brick{0, 1}, Point{4, 18}))
	loggo.Info("checkIsPartFly %v", g.checkIsPartFly(Brick{0, 1}, Point{4, 18}))
	assertb(g.checkIsPartFly(Brick{0, 1}, Point{4, 18}))

	g.Clear()
	g.area[3][19] = true
	loggo.Info("checkIsFly %v", g.checkIsFly(Brick{0, 1}, Point{4, 18}))
	loggo.Info("checkIsPartFly %v", g.checkIsPartFly(Brick{0, 1}, Point{4, 18}))
	assertb(!g.checkIsFly(Brick{0, 1}, Point{4, 18}))
	assertb(g.checkIsPartFly(Brick{0, 1}, Point{4, 18}))

	g.Clear()
	g.area[3][19] = true
	g.area[4][19] = true
	g.area[5][19] = true
	g.area[6][19] = true
	loggo.Info("checkIsPartFly %v", g.checkIsPartFly(Brick{0, 1}, Point{4, 18}))
	assertb(!g.checkIsPartFly(Brick{0, 1}, Point{4, 18}))

	g.Clear()
	g.area[3][19] = true
	g.area[4][19] = true
	g.area[6][19] = true
	loggo.Info("checkIsPartFly %v", g.checkIsPartFly(Brick{0, 1}, Point{4, 18}))
	assertb(g.checkIsPartFly(Brick{0, 1}, Point{4, 18}))

	g.Clear()
	g.Set(5, 8)
	loggo.Info("make_line_key %v", make_line_key(g.area[5][:]))
	assert(g.colline[5], make_line_key(g.area[5][:]))
	assert(g.colline[4], make_line_key(g.area[4][:]))

	g.Clear()
	g.area[0][19] = true
	g.area[1][19] = true
	g.area[1][18] = true
	g.area[5][19] = true
	g.updateLine()
	loggo.Info("GetMaxHeight %v", g.GetMaxHeight(true))
	assert(g.GetMaxHeight(true), 2)
	assert(g.GetMaxHeight(false), 2)
	loggo.Info("GetColumnHeight %v", g.GetColumnHeight(0, true))
	assert(g.GetColumnHeight(0, true), 1)
	assert(g.GetColumnHeight(1, true), 2)
	assert(g.GetColumnHeight(0, false), 1)
	assert(g.GetColumnHeight(1, false), 2)

	g.Clear()
	g.area[0][19] = true
	g.area[1][19] = true
	g.area[1][18] = true
	g.area[5][19] = true
	g.updateLine()
	loggo.Info("GetNum %v", g.GetNum(true))
	assert(g.GetNum(true), 4)
	assert(g.GetNum(false), 4)

}
