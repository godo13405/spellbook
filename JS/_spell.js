'use strict';

const data = require('../data/spell.json'),
    tools = require('./_tools.js');

const spell = {
    init: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let level = `level ${subject.level} spell`;
        if (subject.level === '0') {
            level = "cantrip";
        }
        let output = {
            "data": tools.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    level,
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
        // console.log('TCL: params', params);
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
    ritual: ({
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
    concentration: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                terminal: Boolean(subject.concentration),
                vars: {
                    "name": subject.name
                }
            })
        };
        return output;
    },
    components: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let vars = {
            "name": subject.name,
            "componentsPhrase": []
        };
        if (subject.components.includes('material')) {
            vars.componentsPhrase.push(tools.getPhrase(`${intent.raw}.material`));
        }
        if (subject.components.includes('verbal')) {
            vars.componentsPhrase.push(tools.getPhrase(`${intent.raw}.verbal`));
        }
        if (subject.components.includes('somatic')) {
            vars.componentsPhrase.push(tools.getPhrase(`${intent.raw}.somatic`));
        }
        if (vars.componentsPhrase.length) {
            vars.componentsPhrase = tools.listing({
                str: vars.componentsPhrase
            });
        } else {
            vars.pop();
        }
        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                vars
            })
        };

        return output;
    },
    materials: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let args = {
            phrase: intent.raw,
            vars: {
                "name": subject.name
            }
        };
        if (subject.materials) {
            args.vars.materials = subject.materials;
        } else {
            args.terminal = "false";
        }

        let output = {
            data: tools.phrase(args)
        };
        return output;
    },
    classes: ({
        intent,
        params,
        subject = data[params.spell[0]]
    }) => {
        let classes = [],
            connect = `${intent.raw}.connector`;

        if (subject.class.length > 1) {
            subject.class.forEach(x => {
                classes.push(`${x}s`);
            });
            classes = tools.listing({
                str: classes
            })
        } else {
            classes = `${subject.class[0]}s`;
            connect = `${intent.raw}.connectorSingle`;
        }

        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    connector: tools.getPhrase(connect),
                    classes
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