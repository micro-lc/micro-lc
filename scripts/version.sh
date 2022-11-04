#!/bin/bash

RED="\e[1;31m"
GREEN="\e[1;32m"
ENDCOLOR="\e[0m"

PACKAGE=$1
MODE=$2

if [ -z "$PACKAGE" ]; then
  printf "${RED}no package specified${ENDCOLOR}"
  printf "\nsyntax: ${GREEN}yarn bump <package> <version>${ENDCOLOR}\n"
  exit 1
fi

if [ -z "$MODE" ]; then
  printf "${RED}no version parameter specified: e.g., patch, minor, major or an explicit semver triple like 0.2.9${ENDCOLOR}"
  printf "\nsyntax: ${GREEN}yarn bump <package> <version>${ENDCOLOR}\n"
  exit 1
fi

( cd packages/$PACKAGE ; yarn version $MODE )

git reset
git add packages/$PACKAGE/package.json
git add .yarn/versions

NEW_VERSION=`cat packages/$PACKAGE/package.json | grep version | sed 's/\s\s"version": "//' | sed 's/",$//'`

git commit -e -nm "@micro-lc/$PACKAGE tagged at version: $NEW_VERSION"

git tag -a "@micro-lc/${PACKAGE}@${NEW_VERSION}" -m "@micro-lc/$PACKAGE tagged at version: $NEW_VERSION"

printf "\n${GREEN}push both branch and tag${ENDCOLOR}"
printf "\n\n\tgit push && git push origin @micro-lc/${PACKAGE}@${NEW_VERSION}\n"
