#!/bin/bash
if [ "$1" != "" ]; then
    ./doLaunchScriptServer.sh $1
else
    echo "Positional parameter 1 is empty"
fi
