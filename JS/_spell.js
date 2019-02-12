'use strict';

const data = require('../data/spell.json'),
    tools = require('./_tools.js');

const spell = {
    init: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let output = tools.phrase({
            phrase: intent.raw,
            vars: {
                "name": subject.name,
                "level": subject.level,
            }
        });
        if (subject.damage) {
            output += tools.phrase({
                phrase: intent.raw,
                terminal: "damage",
                vars: {
                    "damage": spell.tools.damage(subject)
                }
            });
        }

        return output;
    },
    damage: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let output = tools.phrase({
            phrase: intent.raw,
            vars: {
                "name": subject.name,
                "damage": subject.damage || tools.phrase({
                    phrase: intent.raw,
                    terminal: "none"
                })
            }
        });
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