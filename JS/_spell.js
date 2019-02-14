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
            let args = {
                    phrase: intent.raw,
                    terminal: "damage",
                    implicitComfirmation: false
                },
                damage = spell.tools.damage(subject.damage);
            if (damage) {
                args.vars = {
                    "damage": damage
                }
            }
            output += tools.phrase(args);
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
                "damage": spell.tools.damage(subject.damage) || tools.phrase({
                    phrase: intent.raw,
                    terminal: "none",
                    implicitComfirmation: false
                })
            }
        });
        return output;
    },
    castingTime: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let cast = [];

        subject.casting_time.forEach(x => {
            cast.push(`${x.amount} ${x.unit}`);
        });

        cast = cast.join(', or');
        let output = tools.phrase({
            phrase: intent.raw,
            vars: {
                "name": subject.name,
                "time": cast
            }
        });
        return output;
    },
    isRitual: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let output = tools.phrase({
            phrase: intent.raw,
            terminal: subject.ritual,
            vars: {
                "name": subject.name
            }
        });
        return output;
    },
    tools: {
        damage: subjectDamage => {
            let damage = false;
            if (subjectDamage) {
                damage = [];
                subjectDamage.forEach(x => {
                    damage.push(`${x.amount}${x.dice} ${x.type} damage`);
                });
                damage = damage.join(', ');
            }

            return damage;
        }
    }
};

exports = module.exports = spell;