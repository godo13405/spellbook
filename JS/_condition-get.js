'use strict';

const data = require('../data/condition.json'),
    tools = require('./_tools.js');

const get = {
    init: ({
        intent,
        params,
        subject = data[params.condition]
    }) => {
        let vars = {
            "name": `${subject.name}`,
            "target": tools.targetRespond(params),
        };

        vars.cant = tools.getAll({
            subject,
            target: 'cant',
            phrase: 'can\'t '
        });

        vars.autoFail = tools.getAll({
            subject,
            target: 'autoFail',
            phrase: 'and automatically fail '
        });

        if (subject.roll) {
            vars.mods = tools.capitalize(tools.getMods({
                mods: subject.roll,
                target: vars.target
            }), true);
        }

        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                vars
            })
        };

        return output;
    },
};


exports = module.exports = get;