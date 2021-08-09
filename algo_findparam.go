package main

import (
	"github.com/esrrhs/go-engine/src/common"
	"github.com/esrrhs/go-engine/src/loggo"
	"sync"
	"sync/atomic"
	"time"
)

func FindScoreParam(ai6_score []float64, N int, step int, quickstep int, thread int, baseheight int, findthread int, slowfilter float64, quickfilter float64) {
	var params []float64

	for _, p := range ai6_score {
		params = append(params, p)
	}

	var result []float64
	for _, p := range params {
		result = append(result, p)
	}

	max := BackSearchBestPathByMixSeeNext(params, N, step, quickstep, thread, baseheight, slowfilter, quickfilter)

	for findstep := 0.1; findstep > 0.00001; findstep /= 10 {
		for z := 0; ; z++ {

			var oldresult []float64
			for j := range result {
				oldresult = append(oldresult, result[j])
			}
			loggo.Info("findstep %v round %v old params %v", findstep, z, oldresult)

			for i := 0; i < len(params); i++ {

				var base []float64
				for j := range result {
					base = append(base, result[j])
					params[j] = result[j]
				}

				loggo.Info("start params %v %v", i, base[i])
				from := -1.0
				to := 1.0
				perstep := (to - from) / findstep / 100
				lastpercent := 0

				var job int32
				var lock sync.Mutex

				for j := from; j <= to; j += findstep {
					params[i] = base[i] + j

					if int(job) < findthread {
						atomic.AddInt32(&job, 1)
						var tmpparams []float64
						for _, p := range params {
							tmpparams = append(tmpparams, p)
						}
						go func() {
							defer common.CrashLog()
							defer atomic.AddInt32(&job, -1)

							n := BackSearchBestPathByMixSeeNext(tmpparams, N, step, quickstep, thread, baseheight, slowfilter, quickfilter)
							if n > max {
								lock.Lock()
								if n > max {
									for i := range tmpparams {
										result[i] = tmpparams[i]
									}
									loggo.Info("findstep %v round %v find params %v %v %v to %v, param %v", findstep, z, i, result[i], max, n, result)
									max = n
								}
								lock.Unlock()
							}
						}()
					} else {
						n := BackSearchBestPathByMixSeeNext(params, N, step, quickstep, thread, baseheight, slowfilter, quickfilter)
						if n > max {
							lock.Lock()
							if n > max {
								for i := range params {
									result[i] = params[i]
								}
								loggo.Info("findstep %v round %v find params %v %v %v to %v, param %v", findstep, z, i, result[i], max, n, result)
								max = n
							}
							lock.Unlock()
						}
					}
					percent := int((j - from) / findstep / perstep)
					if percent != lastpercent {
						lastpercent = percent
						loggo.Info("round %v params %v percent %v", z, i, percent)
					}
				}

				for job > 0 {
					time.Sleep(time.Millisecond * 100)
				}

			}

			loggo.Info("findstep %v round %v new params %v", findstep, z, result)

			allsame := true
			for i := range result {
				if oldresult[i] != result[i] {
					allsame = false
					break
				}
			}
			if allsame {
				break
			}
		}
	}
}
