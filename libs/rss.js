"use strict";

const db = require('./db');
const config = require('../config');

module.exports = {
    async add(userId, rssLink, articleLinks) {
        const collection = db.get().collection(config.collections.links);

        const query = { url: rssLink };
        const link = await collection.findOne(query);
        if (link) {
            await this.update(rssLink, link.articles, [], 1);
            return;
        }

        await collection.insertOne({
            url: rssLink,
            createdAt: new Date(),
            articles: articleLinks,
            author: userId,
            lastGet: 0,
            users: 1
        });
    },

    async remove(rssLink) {
        const collection = db.get().collection(config.collections.links);
        const query = { url: rssLink };
        await collection.updateOne(query, { $inc: { users: -1 } });
    },

    async getAll() {
        const collection = db.get().collection(config.collections.links);
        return await collection.find({ users: { $gt: 0 } }, {
            url: 1,
            articles: 1,
            _id: 0,
        }).toArray();
    },

    async update(url, oldArticles, newArticles, newUsers) {
        const collection = db.get().collection(config.collections.links);
        const query = { url };
        const resultArticles = [ ...newArticles, ...oldArticles ].slice(0, config.oldArticlesCount);
        await collection.updateOne(query, {
            $inc: { users: newUsers },
            $set: { articles: resultArticles },
        });
    }
};
