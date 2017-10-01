"use strict";

module.exports = {
    getNew(allArticles = [], articles = []) {
        return articles.filter(article => {
            return allArticles.indexOf(article) === -1
        });
    }
};
