#!/bin/bash
while IFS='' read -r line || [[ -n "$line" ]]; do
    echo "Start ListenServer on port: $line"
    mkdir out$line
    mkdir out$line/logServer
    ./serv $line recorder > out$line/logServer/outLog-$line.txt &
done < "$1"