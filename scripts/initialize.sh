#!/bin/bash

GREEN="\e[1;32m"
ENDCOLOR="\e[0m"

printf "\n\t\U0001F5D1${GREEN}\tcleanup${ENDCOLOR}"
echo -e "\n"
yarn cleanup

printf "\n\t\u2699${GREEN}\tinterfaces${ENDCOLOR}"
echo -e "\n"
yarn i build

printf "\n\t\U0001f5bc${GREEN}\ticonic${ENDCOLOR}"
echo -e "\n"
yarn c check:types
yarn c prebuild
yarn c build

printf "\n\t\U0001f382${GREEN}\tcomposer${ENDCOLOR}"
echo -e "\n"
yarn c check:types
yarn c build

printf "\n\t\U0001f3ba${GREEN}\torchestrator${ENDCOLOR}"
echo -e "\n"
yarn o check:types
yarn o prebuild
yarn o build

printf "\n\t\u2728${GREEN}\tlayout${ENDCOLOR}"
echo -e "\n"
yarn l check:types
yarn l build
