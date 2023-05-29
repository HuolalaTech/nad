#!/bin/sh

f=CHANGELOG.md

git log | while IFS= read line
do
  if [ "${line% *}" == "commit" ]
  then
    IFS=: read _ author
    IFS=: read _ date
    read _
    read message
    if grep '^\d\+\.\d\+\.\d\+' <<< "$message" > /dev/null
    then
      echo "## $message"
    else
      echo - $message
    fi
  fi
done > $f

npx prettier $f --write
