'use strict';

const tools = require('./_tools.js');

const base = {
    input: {
        welcome: ({
            intent
        }) => {
            let output = {
                data: tools.phrase({
                    phrase: intent.raw,
                }),
                "suggestions": [
                    `What is ${tools.randSpell()}`,
                    `How long to cast ${tools.randSpell()}`
                ]
            };
            return output;
        }
    }
};

exports = module.exports = base;