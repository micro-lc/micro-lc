#!/bin/bash

GREEN="\e[1;32m"
ENDCOLOR="\e[0m"

echo -e "\n\t\U0001F5D1${GREEN}\tcleanup${ENDCOLOR}\n"
yarn cleanup

echo -e "\n\t\u2699${GREEN}\tinterfaces${ENDCOLOR}\n"
yarn i check:types
yarn i build

echo -e "\n\t\U0001f5bc${GREEN}\ticonic${ENDCOLOR}\n"
yarn c check:types
yarn c prebuild
yarn c build

echo -e "\n\t\U0001f382${GREEN}\tcomposer${ENDCOLOR}\n"
yarn c check:types
yarn c build

echo -e "\n\t\U0001f3ba${GREEN}\torchestrator${ENDCOLOR}\n"
yarn o check:types
yarn o prebuild
yarn o build

echo -e "\n\t\u2728${GREEN}\tlayout${ENDCOLOR}\n"
yarn l check:types
yarn l build
