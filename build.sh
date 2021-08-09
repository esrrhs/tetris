set -x
git pull
rm tetris -f
go build
ls ./ -lrth
