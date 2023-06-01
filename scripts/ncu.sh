if ! which ncu
then
  echo 'You must install "ncu" in global first (yarn global add ncu)' >&2
  exit
fi

up() {
  cd $1
  ncu -u
  yarn --no-progress
  yarn upgrade --no-progress
  yarn test
}

export -f up

for name in nad-{builder,cli,home,runtime,ui}
do
  sh -c "up $name" &
done

wait
