'use strict';

const data = require('../data/spell.json'),
    spellTools = require('./_spell-tools.js'),
    tools = require('./_tools.js');

const get = {
    init: ({
        intent,
        params,
        subject = data[params.spell]
    }) => {
        let level;
        if (subject.level === '0') {
            level = `${tools.preposition(subject.school)} ${tools.capitalize(subject.school)} cantrip`;
        } else {
            level = `a level ${subject.level} ${tools.capitalize(subject.school)} spell`;
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
                damage = spellTools.damage(subject.damage);
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
        subject = data[params.spell]
    }) => {
        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    "damage": spellTools.damage(subject.damage) || tools.phrase({
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
        subject = data[params.spell]
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
    duration: ({
        intent,
        params,
        subject = data[params.spell]
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
    components: ({
        intent,
        params,
        subject = data[params.spell]
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
        subject = data[params.spell]
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
        subject = data[params.spell]
    }) => {
        let classes = [],
            connect = `${intent.raw}.connector`;

        if (subject.class.length > 1) {
            subject.class.forEach(x => {
                classes.push(`${tools.capitalize(x)}s`);
            });
            classes = tools.listing({
                str: classes
            })
        } else {
            classes = `${tools.capitalize(subject.class[0])}s`;
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
    school: ({
        intent,
        params,
        subject = data[params.spell]
    }) => {
        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    "school": tools.capitalize(subject.school)
                }
            }),
            suggestions: [
                tools.phrase({
                    phrase: intent.raw,
                    terminal: 'aboutSchool',
                    vars: {
                        "school": `${tools.preposition(subject.school)} ${tools.capitalize(subject.school)}`
                    }
                }),
            ]
        };
        return output;
    },
    description: ({
        intent,
        params,
        subject = data[params.spell]
    }) => {
        let description = subject.description;
        description = description.charAt(0).toLowerCase() + description.substr(1, description.length);
        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    "description": description
                }
            }),
            suggestions: []
        };
        return output;
    },
    level: ({
        intent,
        params,
        subject = data[params.spell]
    }) => {
        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    "level": subject.level
                }
            }),
            suggestions: []
        };
        return output;
    },
    healing: ({
        intent,
        params,
        subject = data[params.spell]
    }) => {
        let vars = {
            "name": subject.name,
            "healing": tools.getPhrase(`${intent.raw}.${false}`)
        };

        if (subject.heal) {
            vars.healing = `${subject.heal.amount}${subject.heal.dice}`;
            if (subject.heal.extra) {
                vars.healing = tools.phrase({
                    phrase: intent.raw,
                    terminal: 'healExtra',
                    vars: {
                        "heal": vars.healing,
                        "extra": subject.heal.extra
                    }
                });
            }
        } else {
            vars.connector = '';
        }


        let output = {
            data: tools.phrase({
                phrase: intent.raw,
                vars
            })
        };
        return output;
    }
};


exports = module.exports = get;