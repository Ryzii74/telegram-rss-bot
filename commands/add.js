"use strict";

const rss = require('../libs/rss');
const users = require('../libs/users');
const config = require('../config');
const feed = require('../libs/feedParser');

module.exports = async function (msg, command) {
    const link = msg.text
        .replace(command.substr, '')
        .trim()
        .replace(/http[s]?:\/\//, '');
    if (!link) return 'Вы не указали ссылку в качестве аргумента';

    const userId = msg.from.id;
    const links = await users.getAllLinks(userId);
    if (links.length >= config.maxUserLinks) return `Вы достигли лимита в количестве ссылок - ${config.maxUserLinks}`;

    let articles;
    try {
        articles = await feed.load(link);
    } catch (err) {
        throw new Error('Не удалось получить данные по ссылке!');
    }

    await users.addLink(userId, link);
    const articleLinks = articles.map(el => el.link);
    await rss.add(userId, link, articleLinks);
    return `Ссылка успешно добавлена в ваш список!\nПоследние статьи: ${articleLinks.join('\n')}`;
};
