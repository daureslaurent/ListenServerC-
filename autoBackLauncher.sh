#!/bin/bash
if [ "$1" != "" ]; then
    mkdir ../out$1
    mkdir ../out$1/logServer
    echo "Launch ListenServer on :$1"
    ./serv $1 recorder > ../out$1/logServer/outLog-$1.txt
else
    echo "Positional parameter 1 is empty"
fi