#!/usr/bin/sh
. ~/.nvm/nvm.sh
nvm use v18.15.0
fuser -k 3001/tcp
npm run dev