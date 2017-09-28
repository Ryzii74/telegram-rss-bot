"use strict";

const got = require('got');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

module.exports = {
    async load(url) {
        const { body } = await got(url);
        const result = await this.parseData(body);
        const items = result.item.map(item => {
            return {
                title: item.title[0],
                link: item.link[0],
                description: item.description[0]
            }
        });
        return items;
    },

    parseData(data) {
        return new Promise((resolve, reject) => {
            parser.parseString(data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rss.channel[0]);
                }
            });
        });
    }
};
