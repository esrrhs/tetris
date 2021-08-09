package main

type Random struct {
	a int64 // 乘子
	M int64 // 模数
	C int64 // 增量
	v int64 // 随机数种子
}

func (r *Random) Reset() {
	r.a = 27073
	r.M = 32749
	r.C = 17713
	r.v = 12358
}

func (r *Random) Rand() int64 {
	v := r.v
	r.v = (v*r.a + r.C) % r.M
	return r.v
}

var gRandom Random
var gBrickCount int

type Brick struct {
	Ty   int
	Stat int
}

func (brick *Brick) Draw() string {
	tmp := make([][]bool, 0)
	for i := -2; i <= 2; i++ {
		t := make([]bool, 0)
		for j := -2; j <= 2; j++ {
			t = append(t, false)
		}
		tmp = append(tmp, t)
	}

	ps := shapes[brick.Ty][brick.Stat]
	for _, p := range ps {
		x := p.X + 2
		y := p.Y + 2
		tmp[y][x] = true
	}

	str := ""
	for _, t := range tmp {
		for _, v := range t {
			if v {
				str += "*"
			} else {
				str += "."
			}
		}
		str += "\n"
	}
	return str
}

/*
game.tetris.curRandomNum = 12358;
game.tetris.curRandomNum = game.tetris.getRandomNum(game.tetris.curRandomNum);
for (i = 0; i < 10; i++) {
  const {
    shapeIndex,
    stateIndex
  } = game.tetris.getShapeInfo(game.tetris.curRandomNum, i);
  console.log("index " + i + " shapeIndex " + shapeIndex + " stateIndex " + stateIndex);
  console.log(game.tetris.shapes[shapeIndex][stateIndex])
  game.tetris.curRandomNum = game.tetris.getRandomNum(game.tetris.curRandomNum);
}
*/
func GetBrickInfo() (int, int) {
	randomNum := gRandom.Rand()
	brickCount := gBrickCount
	gBrickCount++

	weightIndex := randomNum % 29             // 对形状的概率有一定要求：限制每种砖块的出现概率可以让游戏变得更有挑战性
	stateIndex := brickCount % len(shapes[0]) // 形态概率要求不高，随机即可

	shapeIndex := 0
	// I,L,J,T,O,S,Z 型方块的概率权重分别为：2,3,3,4,5,6,6（和为29）
	if weightIndex >= 0 && weightIndex <= 1 {
		shapeIndex = 0
	} else if weightIndex > 1 && weightIndex <= 4 {
		shapeIndex = 1
	} else if weightIndex > 4 && weightIndex <= 7 {
		shapeIndex = 2
	} else if weightIndex > 7 && weightIndex <= 11 {
		shapeIndex = 3
	} else if weightIndex > 11 && weightIndex <= 16 {
		shapeIndex = 4
	} else if weightIndex > 16 && weightIndex <= 22 {
		shapeIndex = 5
	} else if weightIndex > 22 {
		shapeIndex = 6
	}

	return shapeIndex, stateIndex
}
