#!/bin/bash
git checkout autoBackLauncher.sh
git pull
chmod +x autoBackLauncher.sh
cd unix_server/
time make serveur
mv serv ../serv
