#!/usr/bin/sh
. ~/.nvm/nvm.sh
nvm use v18.15.0
git pull
npm i
npm run launch