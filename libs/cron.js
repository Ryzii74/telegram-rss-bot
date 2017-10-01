"use strict";

const Feed = require('./feedParser');
const rss = require('./rss');
const users = require('./users');
const bot = require('./bot');

module.exports = {
    async init() {
        await this.loadAll();
        setInterval(this.loadAll, 1000 * 60 * 5);
    },

    async loadAll() {
        const items = await rss.getAll();
        for (let i = 0, max = items.length; i < max; i++) {
            const item = items[i];

            let articles;
            try {
                articles = await Feed.load(item.url);
            } catch (err) {
                console.error('feedLoadError', err);
                continue;
            }

            const usersToSend = await users.getLinkSubscribers(item.url);

            console.log(item.url, `новых новостей - ${articleIndex}`);
            if (articleIndex !== -1) articles = articles.slice(0, articleIndex);
            articles.reverse().forEach(article => bot.sendToUsers(usersToSend, article.link));
        }
    },
};

