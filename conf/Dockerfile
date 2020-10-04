# BASE
FROM node:14-alpine

WORKDIR /srv/fsheets_ui

COPY rollup.config.js /srv/fsheets_ui/
COPY package*.json /srv/fsheets_ui/
COPY ./node_modules /srv/fsheets_ui/node_modules

RUN npm install
