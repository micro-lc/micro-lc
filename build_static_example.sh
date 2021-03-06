#! /bin/sh

yarn install
yarn --cwd example install

yarn fe-container build
yarn --cwd example build

cp -r ./packages/fe-container/build ./build
cp -r ./example/build/static ./build
cp -r ./example/build ./build/react-app

mkdir -p ./build/api/v1/microlc/
cp ./mock-server/api/v1/microlc/authentication/authentication.json ./build/api/v1/microlc/authentication
cp ./mock-server/api/v1/microlc/configuration/configuration.json ./build/api/v1/microlc/configuration
sed -i 's/\/\/localhost:8764/\/react-app/g' ./build/api/v1/microlc/configuration
cp ./mock-server/api/v1/microlc/user/user.json ./build/api/v1/microlc/user
