#!/usr/bin/sh
cd "$(dirname "$0")"
. ~/.nvm/nvm.sh
nvm use v18.15.0
fuser -k 8420/tcp
npm run prod
