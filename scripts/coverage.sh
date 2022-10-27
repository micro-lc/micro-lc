#!/bin/bash

GREEN="\e[1;32m"
ENDCOLOR="\e[0m"

printf "\n${GREEN}\tCOVERAGE${ENDCOLOR}"
echo -e "\n"
printf "\n\t\xe2\x9d\x93${GREEN}\tDid you build?${ENDCOLOR}"
echo -e "\n"

printf "\n\t\xe2\x9a\x99${GREEN}\tinterfaces${ENDCOLOR}"
echo -e "\n"
yarn i coverage

printf "\n\t\xf0\x9f\x96\xbc${GREEN}\ticonic${ENDCOLOR}"
echo -e "\n"
yarn c prebuild
yarn c coverage

printf "\n\t\xf0\x9f\x8e\x82${GREEN}\tcomposer${ENDCOLOR}"
echo -e "\n"
yarn m coverage

printf "\n\t\xf0\x9f\x8e\xba${GREEN}\torchestrator${ENDCOLOR}"
echo -e "\n"
yarn o prebuild
yarn o coverage

printf "\n\t\xe2\x9c\xa8${GREEN}\tlayout${ENDCOLOR}"
echo -e "\n"
yarn l coverage
