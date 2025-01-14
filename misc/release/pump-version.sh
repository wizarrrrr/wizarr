#!/usr/bin/env bash

#
# Pump one or both of the server/mobile versions in appropriate files
#
# usage: './scripts/pump-version.sh -s <major|minor|patch> <-m>
#
# examples:
#    ./scripts/pump-version.sh -s major        # 1.0.0+50 => 2.0.0+50
#    ./scripts/pump-version.sh -s minor -m     # 1.0.0+50 => 1.1.0+51
#    ./scripts/pump-version.sh -m              # 1.0.0+50 => 1.0.0+51
#

SERVER_PUMP="false"

while getopts 's:m:' flag; do
  case "${flag}" in
  s) SERVER_PUMP=${OPTARG} ;;
  *)
    echo "Invalid args"
    exit 1
    ;;
  esac
done

CURRENT_SERVER=$(jq -r '.version' package.json)
MAJOR=$(echo "$CURRENT_SERVER" | cut -d '.' -f1)
MINOR=$(echo "$CURRENT_SERVER" | cut -d '.' -f2)
PATCH=$(echo "$CURRENT_SERVER" | cut -d '.' -f3)

if [[ $SERVER_PUMP == "major" ]]; then
  MAJOR=$((MAJOR + 1))
  MINOR=0
  PATCH=0
elif [[ $SERVER_PUMP == "minor" ]]; then
  MINOR=$((MINOR + 1))
  PATCH=0
elif [[ $SERVER_PUMP == "patch" ]]; then
  PATCH=$((PATCH + 1))
elif [[ $SERVER_PUMP == "false" ]]; then
  echo 'Skipping Server Pump'
else
  echo 'Expected <major|minor|patch|false> for the server argument'
  exit 1
fi

NEXT_SERVER=$MAJOR.$MINOR.$PATCH

if [ "$CURRENT_SERVER" != "$NEXT_SERVER" ]; then
  echo "Pumping Server: $CURRENT_SERVER => $NEXT_SERVER"
  npm version "$SERVER_PUMP"
  npm ci
  npm run build
fi

./misc/release/archive-version.js "$NEXT_SERVER"

echo "WIZARR_VERSION=v$NEXT_SERVER" >>"$GITHUB_ENV"
