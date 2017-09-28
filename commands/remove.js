"use strict";

const rss = require('../libs/rss');
const users = require('../libs/users');
const config = require('../config');

module.exports = async function (msg, command) {
    const text = msg.text.replace(command.substr, '').trim();
    if (!text) return 'Вы не указали номер ссылки из списка в качестве аргумента';

    console.log(text);
    const number = Number(text);
    if (number < 0 || isNaN(number)) return 'Аргументом команды должен быть номер ссылки из списка!';

    const userId = msg.from.id;
    const link = await users.getLinkByNumber(userId, number);
    if (!link) return 'Аргументом команды должен быть номер ссылки из списка!';

    await users.removeLink(userId, link);
    await rss.remove(link);
    return 'Ссылка успешно удалена из вашего списка!';
};
