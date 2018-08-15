#!/bin/bash
git checkout autoBackLauncher.sh
git pull
chmod +x autoBackLauncher.sh
chmod +x launcher.sh
if [ -f "serv.bin" ]
then
	echo "No need compile server ..."
else
	echo "Need compil ..."
    cd unix_server/
    time make serveur
    mv serv ../serv.bin
fi

echo "Update finshed !"
