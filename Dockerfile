FROM node:8

COPY . /opt/rss-bot
WORKDIR /opt/rss-bot

RUN npm install --production

CMD NODE_ENV=production npm start