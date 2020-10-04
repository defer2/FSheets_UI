#!/bin/zsh

cd ..
docker build -t fsheets_ui:base -f conf/Dockerfile .
docker build -t fsheets_ui .