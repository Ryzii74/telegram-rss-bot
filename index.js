"use strict";

const Bot = require('./libs/bot');
const config = require('./config');
const db = require('./libs/db');
const cron = require('./libs/cron');

async function startApp() {
    try {
        await db.init(config.db);
        Bot.init(config.bot);
        await cron.init();
    } catch (err) {
        console.error('initAppError', err);
    }
}

startApp();
