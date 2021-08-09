set -x
go tool pprof --dot my.pro > my.dot
./png -i my.dot -png my.png
sz my.png
