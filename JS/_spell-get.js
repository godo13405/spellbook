/* eslint-disable max-lines */

'use strict';

const data = require('../data/spell.json'),
    tools = require('./tools/_tools.js');

const get = {
    init: ({
        intent,
        params,
        subject = data[params.spell]
    }) => {
        let level;
        if (!subject.level) {
            level = `${tools.text.preposition(subject.school)} ${tools.text.capitalize(subject.school)} cantrip`;
        } else {
            level = `a level ${subject.level} ${tools.text.capitalize(subject.school)} spell`;
        }
        let output = {
            "data": tools.text.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    level,
                }
            }),
            "suggestions": [],
        };
        if (subject.audio) {
            output.audio = subject.audio;
        }
        if (subject.damage) {
            let args = {
                    phrase: intent.raw,
                    terminal: "damage",
                    implicitConfirmation: false
                },
                damage = tools.spell.damage(subject.damage);
            if (damage) {
                args.vars = {
                    "damage": damage
                }
            }
            output.data += tools.text.phrase(args);
        }

        return output;
    },
    damage: ({
        intent,
        params,
        subject = data[params.spell]
    }) => {
        let output = {
            data: tools.text.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    "damage": tools.spell.damage(subject.damage) || tools.text.phrase({
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
            data: tools.text.phrase({
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
        let connector = tools.text.getPhrase(`${intent.raw}.connector.lasts`);
        // Change the phrasing for instantaneous
        if (subject.duration === 'instantaneous') {
            connector = tools.text.getPhrase(`${intent.raw}.connector.instant`);
        }
        let output = {
            data: tools.text.phrase({
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
            vars.componentsPhrase.push(tools.text.getPhrase(`${intent.raw}.material`));
        }
        if (subject.components.includes('verbal')) {
            vars.componentsPhrase.push(tools.text.getPhrase(`${intent.raw}.verbal`));
        }
        if (subject.components.includes('somatic')) {
            vars.componentsPhrase.push(tools.text.getPhrase(`${intent.raw}.somatic`));
        }
        if (vars.componentsPhrase.length) {
            vars.componentsPhrase = tools.listing({
                str: vars.componentsPhrase
            });
        } else {
            vars.pop();
        }
        let output = {
            data: tools.text.phrase({
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
            data: tools.text.phrase(args)
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
                classes.push(`${tools.text.capitalize(x)}s`);
            });
            classes = tools.text.listing({
                str: classes
            })
        } else {
            classes = `${tools.text.capitalize(subject.class[0])}s`;
            connect = `${intent.raw}.connectorSingle`;
        }

        let output = {
            data: tools.text.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    connector: tools.text.getPhrase(connect),
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
            data: tools.text.phrase({
                phrase: intent.raw,
                vars: {
                    "name": subject.name,
                    "school": tools.text.capitalize(subject.school)
                }
            }),
            suggestions: [
                tools.text.phrase({
                    phrase: intent.raw,
                    terminal: 'aboutSchool',
                    vars: {
                        "school": `${tools.text.preposition(subject.school)} ${tools.text.capitalize(subject.school)}`
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
            data: tools.text.phrase({
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
            data: tools.text.phrase({
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
            "healing": tools.text.getPhrase(`${intent.raw}.${false}`)
        };

        if (subject.heal) {
            vars.healing = `${subject.heal.amount}${subject.heal.dice}`;
            if (subject.heal.extra) {
                vars.healing = tools.text.phrase({
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
            data: tools.text.phrase({
                phrase: intent.raw,
                vars
            })
        };
        return output;
    },
    higherLevel: ({
        intent,
        params,
        subject = data[params.spell]
    }) => {
        let vars = {
                "name": subject.name,
                "level": parseInt(params.level, 10)
            },
            terminal = false;
        const levelDifference = params.level - subject.level;
        if (subject.higher_levels) {
            terminal = 'base';

            if (subject.higherLevelDamage) {
                let damage = tools.fn.clone(subject.damage);
                if (subject.level) {
                    // calculate the extra damage
                    // eslint-disable-next-line no-plusplus
                    damage.forEach(x => {
                        subject.higherLevelDamage.forEach(y => {
                            if (x.dice === y.dice && x.type === y.type) {
                                x.amount += y.amount * levelDifference;
                            }
                        });
                    });

                    terminal = 'damage';
                } else {
                    let timesUpgraded = 0;
                    // check which tier level to look at
                    subject.higherLevelTiers.forEach(x => {
                        if (x <= params.level) {
                            timesUpgraded += 1;
                        }
                    });

                    damage.forEach(x => {
                        x.amount += timesUpgraded;
                    });

                    terminal = 'cantrip';
                }
                vars.higherLevel = tools.spell.damage(damage);
            } else if (subject.higherLevelTarget) {
                const targetNumber = subject.higherLevelTarget.amount * levelDifference + subject.targets;
                vars.higherLevel = `${targetNumber} ${subject.higherLevelTarget.target}`;
                terminal = 'target';

                if (subject.higherLevelTarget.separated) {
                    vars.higherLevel += ` ${tools.text.phrase({
                        phrase: intent.raw,
                        terminal: 'targetSeparated',
                        vars: subject.higherLevelTarget
                    })}`;
                }
            }
        }

        let output = {
            data: tools.text.phrase({
                phrase: intent.raw,
                terminal,
                vars
            })
        };
        return output;
    }
};


exports = module.exports = get;