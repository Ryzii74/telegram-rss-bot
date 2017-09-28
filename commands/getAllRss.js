"use strict";

const users = require('../libs/users');

module.exports = async function (msg) {
    const userId = msg.from.id;
    const links = await users.getAllLinks(userId);
    const result = links.map((el, index) => `${index + 1}) ${el}`).join('\n');
    if (result) {
        return 'Ваш список:\n' + result;
    } else {
        return 'Ваш список пуст';
    }
};
