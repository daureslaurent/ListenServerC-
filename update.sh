#!/bin/bash
git pull
cd unix_server/
time make serveur
mv serv ../serv
