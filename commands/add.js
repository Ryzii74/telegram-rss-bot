"use strict";

const rss = require('../libs/rss');
const users = require('../libs/users');
const config = require('../config');
const feed = require('../libs/feedParser');

module.exports = async function (msg, command) {
    const link = msg.text.replace(command.substr, '').trim();
    if (!link) return 'Вы не указали ссылку в качестве аргумента';

    let articles;
    try {
        articles = await feed.load(link);
    } catch (err) {
        throw new Error('Не удалось получить данные по ссылке!');
    }

    const userId = msg.from.id;
    await users.addLink(userId, link);
    const lastArticle = articles[0].link;
    await rss.add(userId, link, lastArticle);
    return `Ссылка успешно добавлена в ваш список!\nПоследняя статья - ${lastArticle}`;
};
