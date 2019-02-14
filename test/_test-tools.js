'use strict';

const testTools = {
    copy: src => {
        return JSON.parse(JSON.stringify(src));
    }
};

exports = module.exports = testTools;