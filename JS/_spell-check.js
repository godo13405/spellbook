'use strict';

const data = require('../data/spell.json'),
    tools = require('./_tools.js');

const get = {
    ritual: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                terminal: subject.ritual,
                vars: {
                    "name": subject.name
                }
            })
        };
        return output;
    },
    concentration: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                terminal: Boolean(subject.concentration),
                vars: {
                    "name": subject.name
                }
            })
        };
        return output;
    },
    classes: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        const terminal = subject.class.includes(params.class[0]),
            output = {
                data: tools.phrase({
                    phrase: intent.raw,
                    terminal,
                    vars: {
                        "name": subject.name,
                        "class": `${tools.capitalize(params.class[0])}s`
                    }
                })
            };

        return output;
    }
};


exports = module.exports = get;