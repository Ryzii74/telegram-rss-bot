"use strict";

const Feed = require('./feedParser');
const rss = require('./rss');
const users = require('./users');
const bot = require('./bot');
const Articles = require('./articles');

module.exports = {
    async init() {
        await this.loadAll();
        setInterval(this.loadAll, 1000 * 60 * 5);
    },

    async loadAll() {
        console.log('Обновление данных', new Date());
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

            const newArticles = Articles.getNew(item.articles, articles.map(el => el.link));
            console.log(item.url, `новых новостей - ${newArticles.length}`);
            if (newArticles.length === 0) continue;

            const usersToSend = await users.getLinkSubscribers(item.url);
            newArticles.reverse().forEach(article => bot.sendToUsers(usersToSend, article));

            await rss.update(item.url, item.articles || [], newArticles || [], 0);
        }
    },
};

