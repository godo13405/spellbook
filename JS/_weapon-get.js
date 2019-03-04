'use strict';

const data = require('../data/weapon.json'),
    tools = require('./tools/_tools.js');

const get = {
    init: ({
        intent,
        params,
        subject = data[params.weapon]
    }) => {
        let vars = {
            "name": `${tools.text.preposition(subject.name).toUpperCase()} ${subject.name}`,
            "tier": subject.tier,
            "type": subject.type
        };

        if (subject.damage) {
            vars.dmg = [];

            subject.damage.forEach(x => {
                vars.dmg.push(`${x.amount}${x.dice}`);
            });

            vars.dmg = tools.text.listing({
                str: vars.dmg,
                connector: 'or '
            });

            vars.dmg += ` ${subject.damage[0].type}`;

            if (subject.damage.length > 1) {
                vars.twoHanded = tools.text.getPhrase(`${intent.raw}.twoHanded`);
            }

            vars.damage = tools.text.phrase({
                phrase: intent.raw,
                terminal: '_damage',
                vars
            })
        }

        let output = {
            data: tools.text.phrase({
                phrase: intent.raw,
                vars
            })
        };

        return output;
    },
    damage: ({
        intent,
        params,
        subject = data[params.weapon]
    }) => {
        let vars = {
            "name": `${tools.text.preposition(subject.name).toUpperCase()} ${subject.name}`
        };

        if (subject.damage) {
            let dmg = [];

            subject.damage.forEach(x => {
                dmg.push(`${x.amount}${x.dice}`);
            });

            dmg = tools.text.listing({
                str: dmg,
                connector: 'or '
            });

            dmg += ` ${subject.damage[0].type}`;

            vars.damage = dmg;

            if (subject.damage.length > 1) {
                vars.twoHanded = tools.text.getPhrase(`${intent.raw}.twoHanded`);
            }
        }

        let output = {
            data: tools.text.phrase({
                phrase: intent.raw,
                vars
            })
        };

        return output;
    },
    price: ({
        intent,
        params,
        subject = data[params.weapon]
    }) => {
        let vars = {
            "name": `${tools.text.preposition(subject.name).toUpperCase()} ${subject.name}`
        };

        if (subject.cost.amount > 1) {
            vars.price = `${subject.cost.amount} ${subject.cost.unit} coins`;
        } else {
            vars.price = `a ${subject.cost.unit} coin`
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