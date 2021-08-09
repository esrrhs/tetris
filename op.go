package main

import (
	"strconv"
	"strings"
)

const (
	// L（左移）, R（右移）, D（下降）, C（旋转）, N（新方块）
	OP_L = 0
	OP_R = 1
	OP_D = 2
	OP_C = 3
	OP_N = 4
)

type Op int

type OpList struct {
	list []Op
}

func (ol *OpList) Add(op Op) {
	ol.list = append(ol.list, op)
}

func (ol *OpList) Pop() {
	ol.list = ol.list[0 : len(ol.list)-1]
}

func (ol *OpList) Clear() {
	ol.list = ol.list[0:0]
}

func (ol *OpList) Copy() OpList {
	ol2 := OpList{}
	ol2.list = make([]Op, len(ol.list))
	copy(ol2.list, ol.list)
	return ol2
}

func (ol *OpList) Empty() bool {
	return len(ol.list) == 0
}

func (ol *OpList) ToString() string {
	str := ""
	last := -1
	lastn := 0
	for _, op := range ol.list {
		if int(op) == last {
			lastn++
		} else {
			if last != -1 {
				if last == OP_C {
					str += "C"
				} else if last == OP_L {
					str += "L"
				} else if last == OP_R {
					str += "R"
				} else if last == OP_D {
					str += "D"
				}
				str += strconv.Itoa(lastn)
				str += ","
				last = -1
				lastn = 0
			}

			last = int(op)
			lastn = 1
		}
	}

	if last != -1 {
		if last == OP_C {
			str += "C"
		} else if last == OP_L {
			str += "L"
		} else if last == OP_R {
			str += "R"
		} else if last == OP_D {
			str += "D"
		}
		str += strconv.Itoa(lastn)
		str += ","
	}

	str = strings.TrimRight(str, ",")

	return str
}

type MovPath struct {
	Dst   Point
	Opl   OpList
	Stat  int
	Score float64
}

type MovPathList struct {
	list []MovPath
}

func (mpl *MovPathList) Add(mp MovPath) {
	mpl.list = append(mpl.list, mp)
}

func (mpl *MovPathList) Pop() {
	mpl.list = mpl.list[0 : len(mpl.list)-1]
}

func (mpl *MovPathList) Len() int {
	return len(mpl.list)
}

func (mpl *MovPathList) List() []MovPath {
	return mpl.list
}

func (mpl *MovPathList) ToString() string {
	ret := ""
	for _, mv := range mpl.list {
		ret += "N,"
		ret += mv.Opl.ToString()
		ret += ","
	}
	ret = strings.TrimRight(ret, ",")
	return ret
}
