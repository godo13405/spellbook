'use strict';

const tools = {
    capitalize: txt => {
        if (typeof txt === 'string') {
            txt = txt.replace(/\b\w/g, l => l.toUpperCase());
        } else {
            console.log('\x1b[31m', 'What you tried to capitalize isn\'t a string', '\x1b[0m');
        }
        return txt;
    },
    phrase: ({
        phrase,
        terminal = 'base',
        lib = require('../phrases.json'),
        vars = {}
    }) => {
        phrase += `.${terminal}`;

        // check if the phrase exists
        let directions = phrase.split('.'),
            str;

        directions.forEach(x => {
            if (str) {
                str = str[x];
            } else if (lib[x]) {
                str = lib[x];
            } else {
                console.log(`${phrase} not found`);
                return false;
            }
        });

        // choose a random phrase from the array
        if (Array.isArray(str)) {
            str = str[Math.floor(Math.random()*str.length)];
        }

        // replace tags
        if (Object.keys(vars).length) {
            for (const i in vars) {
                let r = new RegExp(`<${i}>`, "g");
                str = str.replace(r, vars[i]);
            }
        }

        return str;
    }
};

exports = module.exports = tools;