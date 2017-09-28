"use strict";

const db = require('./db');
const config = require('../config');

module.exports = {
    async add(user) {
        const collection = db.get().collection(config.collections.users);

        const userDocument = await collection.findOne({ id: user.id });
        if (userDocument) return null;

        user.createdAt = new Date();
        user.lastUsed = new Date();
        user.links = [];
        await collection.insertOne(user);
    },

    async addLink(userId, link) {
        await db.get().collection(config.collections.users)
            .updateOne({ id: userId }, { $addToSet: { links: link } });
    },

    async removeLink(userId, link) {
        await db.get().collection(config.collections.users)
            .updateOne({ id: userId }, { $pull: { links: link } });
    },

    async getLinkByNumber(userId, number) {
        const links = await this.getAllLinks(userId);
        return links[number - 1];
    },

    async getAllLinks(userId) {
        const { links } = await db.get().collection(config.collections.users)
            .findOne({ id: userId }, { links: 1, _id: 0 });
        return links;
    },

    async getLinkSubscribers(link) {
        const users = await db.get().collection(config.collections.users)
            .find({ links: link }, { id: 1, _id: 0 }).toArray();
        return users.map(user => user.id);
    },
};
