'use strict';

const tools = {
    copy: src => {
        return JSON.parse(JSON.stringify(src));
    }
};

exports = module.exports = tools;