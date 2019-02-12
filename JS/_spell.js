'use strict';

const data = require('../data/spell.json'),
    tools = require('./_tools.js');

const spell = {
    description: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let output = `${tools.capitalize(subject.name)} is a level ${subject.level} spell`;
        if (subject.damage) {
            output +=` which does ${spell.tools.damage(subject)}.`;
        }

        return output;
    },
    damage: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let output = `${tools.capitalize(params.spell[0])} does no damage.`;
        if (subject.damage) {
            output = `${tools.capitalize(params.spell[0])} does ${spell.tools.damage(subject)}.`;
        }
        
        return output;
    },
    tools: {
        damage: subject => {
            let damage = [];
            subject.damage.forEach(x => {
                damage.push(`${x.amount}${x.dice} ${x.type} damage`);
            });
            damage = damage.join(', ');

            return damage;
        }
    }
};

exports = module.exports = spell;