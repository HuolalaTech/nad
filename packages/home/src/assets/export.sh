base=${0%/*}
out=$base/index.ts
: > $out
for svg in $base/*.svg
do
  file=${svg##*/}
  name=${file%.svg}
  echo "export { default as $name } from './$file';" >> $out
done
