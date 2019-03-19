'use strict';

const data = require('../data/condition.json'),
    tools = require('./tools/_tools.js');

const get = {
    init: ({
        intent,
        params,
        subject = data[params.condition]
    }) => {
        let vars = {
            "name": `${subject.name}`,
            "target": tools.text.targetRespond.default(params),
        };

        vars.cant = tools.text.getAll({
            subject,
            target: 'cant',
            phrase: 'can\'t '
        });

        vars.autoFail = tools.text.getAll({
            subject,
            target: 'autoFail',
            phrase: 'and automatically fail '
        });

        if (subject.roll) {
            vars.mods = tools.text.capitalize(tools.text.getMods({
                mods: subject.roll,
                target: vars.target
            }), true);
        }

        let output = {
            data: tools.text.phrase({
                phrase: intent.raw,
                vars
            })
        };

        return output;
    },
    mods: ({
        intent,
        params,
        subject = data[params.condition]
    }) => {
        let vars = {
            "name": `${subject.name}`,
            "target": tools.text.targetRespond.default(params),
        };

        vars.cant = tools.text.getAll({
            subject,
            target: 'cant',
            phrase: 'can\'t '
        });

        vars.autoFail = tools.text.getAll({
            subject,
            target: 'autoFail',
            phrase: 'and automatically fail '
        });

        if (subject.roll) {
            vars.mods = tools.text.capitalize(tools.text.getMods({
                mods: subject.roll,
                target: vars.target
            }), true);
        }

        let output = {
            data: tools.text.phrase({
                phrase: intent.raw,
                vars
            })
        };

        return output;
    },
};


exports = module.exports = get;