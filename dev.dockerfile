FROM node:8

RUN npm i -g nodemon

VOLUME /opt/rss-bot
WORKDIR /opt/rss-bot

CMD NODE_ENV=test npm test