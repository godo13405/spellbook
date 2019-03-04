'use strict';

const data = require('../data/spell.json'),
    tools = require('./tools/_tools.js');

const get = {
    ritual: ({
        intent,
        params,
        subject = data[params.spell]
    }) => {
        let output = {
            data: tools.text.phrase({
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
        subject = data[params.spell]
    }) => {
        let output = {
            data: tools.text.phrase({
                phrase: intent.raw,
                terminal: Boolean(subject.concentration),
                vars: {
                    "name": subject.name
                }
            })
        };
        return output;
    },
    class: ({
        intent,
        params,
        subject = data[params.spell]
    }) => {
        const terminal = subject.class.includes(params.class.toLowerCase());

        const output = {
            data: tools.text.phrase({
                phrase: intent.raw,
                terminal,
                vars: {
                    "name": subject.name,
                    "class": `${tools.text.capitalize(params.class)}s`
                }
            })
        };

        return output;
    },
    higherLevel: ({
        intent,
        params,
        subject = data[params.spell]
    }) => {
        const output = {
            data: tools.text.phrase({
                phrase: intent.raw,
                terminal: Boolean(subject.higher_levels),
                vars: {
                    "name": subject.name,
                }
            })
        };

        return output;
    }
};


exports = module.exports = get;