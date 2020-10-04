FROM node:14-alpine

WORKDIR /Users/defer2/PycharmProjects/FSheets_UI

COPY rollup.config.js ./
COPY package*.json ./
COPY conf/configuration.js ./conf/configuration.js

RUN npm install

COPY ./src ./src
COPY ./public ./public
COPY ./node_modules ./node_modules

RUN npm run-script build
EXPOSE 5000

ENV HOST=0.0.0.0

CMD [ "npm", "start" ] 




