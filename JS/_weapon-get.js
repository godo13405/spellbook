'use strict';

const data = require('../data/weapon.json'),
    tools = require('./_tools.js');

const get = {
    init: ({
        intent,
        params,
        subject = data[params.weapon[0]]
    }) => {
        let vars = {
            "name": `${tools.preposition(subject.name).toUpperCase()} ${subject.name}`,
            "tier": subject.tier,
            "type": subject.type
        };

        if (subject.damage) {
            let dmg = [];

            subject.damage.forEach(x => {
                dmg.push(`${x.amount}${x.dice}`);
            });

            dmg = tools.listing({
                str: dmg,
                connector: 'or '
            });

            dmg += ` ${subject.damage[0].type}`;

            vars.damage = tools.phrase({
                phrase: intent.raw,
                terminal: '_damage',
                vars: {
                    dmg
                }
            })
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