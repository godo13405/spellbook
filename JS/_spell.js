'use strict';

const data = require('../data/spell.json'),
    tools = require('./_tools.js');

const spell = {
    description: ({intent,params}) => {
        let output;

        const subject = data[params.spell[0]];

        output = `${tools.capitalize(params.spell[0])} is a level ${subject.level} which does `;

        let damage = [];
        subject.damage.forEach(x => {
            damage.push(`${x.amount}${x.dice} ${x.type} damage`);
        });
        damage = damage.join(', ');

        output += `${damage}.`;


        return output;
    }
};

exports = module.exports = spell;