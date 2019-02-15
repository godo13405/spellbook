'use strict';

const data = require('../data/spell.json'),
    tools = require('./_tools.js');

const spell = {
    init: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let output = {
            "data": tools.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    "level": subject.level,
                }
            }),
            "suggestions": []
        };
        if (subject.damage) {
            let args = {
                    phrase: intent.raw,
                    terminal: "damage",
                    implicitConfirmation: false
                },
                damage = spell.tools.damage(subject.damage);
            if (damage) {
                args.vars = {
                    "damage": damage
                }
            }
            output.data += tools.phrase(args);
        }

        return output;
    },
    damage: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    "damage": spell.tools.damage(subject.damage) || tools.phrase({
                        phrase: intent.raw,
                        terminal: "none",
                        implicitConfirmation: false
                    })
                }
            })
        };
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
        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    "time": cast
                }
            })
        };
        return output;
    },
    isRitual: ({
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
    duration: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let connector = tools.getPhrase(`${intent.raw}.connector.lasts`);
        // Change the phrasing for instantaneous
        if (subject.duration === 'instantaneous') {
            connector = tools.getPhrase(`${intent.raw}.connector.instant`);
        }
        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    "connector": connector,
                    "time": subject.duration
                }
            })
        };
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