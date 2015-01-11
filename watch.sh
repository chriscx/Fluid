#!/bin/bash

if [ $1 = "start" ]; then
  nohup jade -P -w client/app/views/ -o client/public/views/ &
  # nohup coffee -b -o client/public/ --no-header -w client/app/
elif [ $1 = "stop" ]; then
  # kill `ps aux | grep "[c]offee -b -o client/public/ --no-header -w client/app/" | awk '{ print $2 }'`
  kill `ps aux | grep "[n]ode /usr/local/bin/jade -P -w" | awk '{ print $2 }'`
else
  echo "unknown parameter"
fi
