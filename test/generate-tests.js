'use strict';

const fs = require('fs'),
    router = require('../JS/_router.js');


const generate = {
    do: entity => {
        const txt = {
                'me': `entity.${entity}.get.init.me`,
                'bot': `entity.${entity}.get.init.bot`
            },
            subject = require(`../data/${entity}.json`),
            subjectNames = Object.keys(subject);
        for (const x of subjectNames) {
            const y = subject[x],
                me = `what is ${y.name}`;
            let req = {
                "queryResult": {
                    "queryText": me,
                    "action": `${entity}.get.init`,
                    "parameters": {}
                }
            };
            req.queryResult.parameters[entity] = x;
            const bot = JSON.parse(router.ready(req));

            txt.me += `\n${me}`;
            txt.bot += `\n${bot.fulfillmentText}`;
        }
        generate.write(entity, 'get.init.me.utterances', txt.me);
        generate.write(entity, 'get.init.bot.utterances', txt.bot);
    },
    write: (entity, name, content) => {
        fs.writeFile(`spec/convo/entity/${entity}/${name}.txt`, content, err => {
            if (!err) {
                // eslint-disable-next-line no-console
                console.log(`${entity}.${name}.txt created`);
            }
        });
    }
};

generate.do('spell');
generate.do('weapon');