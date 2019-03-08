'use strict';

const fs = require('fs'),
    spells = require('../data/spell.json'),
    router = require('../JS/_router.js');


const generate = () => {
    const txt = {
            'me': 'entity.spell.get.init.me',
            'bot': 'entity.spell.get.init.bot'
        },
        spellNames = Object.keys(spells);
    for (const x of spellNames) {
        const y = spells[x],
            me = `what is ${y.name}`,
            req = {
                "queryResult": {
                    "queryText": me,
                    "action": "spell.get.init",
                    "parameters": {
                        "spell": x
                    }
                }
            },
            bot = JSON.parse(router.ready(req));

        txt.me += `\n${me}`;
        txt.bot += `\n${bot.fulfillmentText}`;
    }
    fs.writeFile(`spec/convo/entity/spell/get.init.me.utterances.txt`, txt.me, err => {
        if (!err) {
            // eslint-disable-next-line no-console
            console.log(`get.init.me.utterances.txt created`);
        }
    });
    fs.writeFile(`spec/convo/entity/spell/get.init.bot.utterances.txt`, txt.bot, err => {
        if (!err) {
            // eslint-disable-next-line no-console
            console.log(`get.init.bot.utterances.txt created`);
        }
    });
    // console.log(output);
};

generate();