FROM fsheets_ui:base

WORKDIR /srv/fsheets_ui

COPY ./src ./src
COPY ./public ./public
COPY rollup.config.js ./
COPY package*.json ./

EXPOSE 5000

ENV HOST=0.0.0.0

CMD npm run-script build && npm start




