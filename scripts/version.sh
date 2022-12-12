#!/bin/bash

RED="\e[1;31m"
GREEN="\e[1;32m"
PURPLE="\e[1;35m"
ENDCOLOR="\e[0m"

PACKAGE=$1
MODE=$2

if [ -z "$PACKAGE" ]; then
  printf "${RED}no package specified: micro-lc, interfaces, iconic, composer, orchestrator, layout${ENDCOLOR}"
  printf "\nsyntax: ${GREEN}yarn bump <package> <version>${ENDCOLOR}\n"
  exit 1
fi

if [ -z "$MODE" ]; then
  printf "${RED}no version parameter specified: e.g., patch, minor, major or an explicit semver triple like 0.2.9${ENDCOLOR}"
  printf "\nsyntax: ${GREEN}yarn bump <package> <version>${ENDCOLOR}\n"
  exit 1
fi

if [ "micro-lc" = "$PACKAGE" ]; then
  WORKING_DIR='.'
  TAG_SCOPE='micro-lc'
  TAG_PREFIX_NAME='v'
else
  WORKING_DIR="./packages/$PACKAGE"
  TAG_SCOPE="@micro-lc/$PACKAGE"
  TAG_PREFIX_NAME="${TAG_SCOPE}@"
fi

( cd $WORKING_DIR ; yarn version $MODE )

git reset
git add $WORKING_DIR/package.json
git add .yarn/versions

unameOut="$(uname -s)"
case "${unameOut}" in
    Darwin*)
      NEW_VERSION=`cat $WORKING_DIR/package.json | grep "\"version\":" | sed -E 's/(\s\s)?"version": "//' | sed -E 's/",$//'`
      NEW_VERSION=`echo $NEW_VERSION`
      ;;
    *)
      NEW_VERSION=`cat $WORKING_DIR/package.json | grep "\"version\":" | sed 's/\s\s"version": "//' | sed 's/",$//'`
esac

if [ -z "$NEW_VERSION" ]; then
  printf "${RED}ERROR: no version found in $WORKING_DIR/package.json${ENDCOLOR}\n"
  exit 1
fi

git commit -e -nm "$TAG_SCOPE tagged at version: $NEW_VERSION"

git tag -a "${TAG_PREFIX_NAME}${NEW_VERSION}" -m "$TAG_SCOPE tagged at version: $NEW_VERSION"

printf "\n${GREEN}\tpush both branch and tag:${ENDCOLOR}"
printf "\n\n\t${PURPLE}git push && git push origin ${TAG_PREFIX_NAME}${NEW_VERSION}${ENDCOLOR}\n\n"
