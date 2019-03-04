'use strict';

// Options
// eslint-disable-next-line no-unused-vars
const options = require('../_globalOptions.js');

const tools = {
    capitalize: (txt, first) => {
        if (first) {
            txt = txt.charAt(0).toUpperCase() + txt.slice(1);
        } else if (typeof txt === 'string') {
            txt = txt.replace(/\b\w/g, l => l.toUpperCase());
        } else {
            // eslint-disable-next-line no-console
            console.log('\x1b[31m', 'What you tried to capitalize isn\'t a string', '\x1b[0m');
        }
        return txt;
    },
    preposition: txt => {
        let output = 'a';
        if (typeof txt === 'string') {
            const anLetters = [
                'a',
                'e',
                'i',
                'o'
            ];
            if (anLetters.includes(txt.toLowerCase().substring(1))) {
                output = 'an';
            }
        } else {
            // eslint-disable-next-line no-console
            console.log('tools.prepositioon Error: expected txt to be a string, got ', typeof txt);
        }

        return output;
    },
    stripSsml: txt => {
        return txt.replace(/<[a-zA-Z0-9s='"\s/]*>/g, '');
    },
    phrase: ({
        phrase,
        terminal = 'base',
        vars = {},
        implicitConfirm = global.implicitConfirmation
    }) => {
        if (implicitConfirm) {
            let confirm = tools.phrasing.build({
                phrase,
                terminal: 'implicitConfirmation',
                vars
            });

            if (confirm) {
                vars.confirm = confirm;
            }

            // If no connector has been defined, take the default
            const connect = tools.getPhrase(`${phrase}.connector`);
            if (vars.connector === undefined && connect) {
                vars.connector = connect;
            }
        }

        const args = {
            phrase,
            terminal,
            vars
        };
        const output = tools.phrasing.build(args);

        return output.trim();
    },
    getPhrase: phrase => {
        // takes full path to phrase
        return tools.phrasing.rand(tools.phrasing.find({
            phrase
        }));
    },
    getAll: ({
        subject,
        target,
        connector = ' or ',
        phrase
    }) => {
        let output = tools.phrasing.find({
            phrase: target,
            lib: subject
        });

        output = tools.listing({
            str: output,
            connector
        });

        output = phrase + output;

        return output;
    },
    phrasing: {
        build: ({
            phrase,
            terminal,
            vars
        }) => {
            let str = tools.phrasing.find({
                phrase: `${phrase}.${terminal}`
            });
            if (str) {
                str = tools.phrasing.rand(str);
                str = tools.phrasing.tags({
                    str,
                    vars
                });
            } else if (terminal === 'implicitConfirmation') {
                // default implicit confirmation
                str = tools.phrasing.tags({
                    str: '<name>',
                    vars
                });
            }

            return str;
        },
        find: ({
            phrase,
            lib = require('../../data/phrases.json'),
        }) => {
            // check if the phrase exists
            let directions = phrase.split('.'),
                str;

            directions.forEach(x => {
                if (str) {
                    str = str[x];
                } else if (lib[x]) {
                    str = lib[x];
                }
            });

            return str;
        },
        rand: str => {
            // choose a random phrase from the array
            let key = 0,
                output;

            if (Array.isArray(str)) {
                if (global.randomPhrase && str.length > 0) {
                    key = Math.floor(Math.random() * str.length);
                }
                output = str[key];
            }
            return output;
        },
        tags: ({
            str,
            vars
        }) => {
            // replace tags
            if (Object.keys(vars).length) {
                for (const i in vars) {
                    let r = new RegExp(`<${i}>`, "g");
                    str = str.replace(r, vars[i]);
                }
            }

            // remove unused tags
            str = str.replace(/<[a-zA-Z0-9\s]*>/g, '');

            return str;
        }
    },
    listing: ({
        str,
        connector = 'and '
    }) => {
        let output = str;
        if (Array.isArray(str)) {
            output = str[0];
            if (str.length > 1) {
                output = `${str.slice(0, -1).join(', ')}, ${connector}${str.slice(-1)}`;
            }
        }
        return output;
    },
    targetRespond: params => {
        let target,
            targetMap = {
                'me': 'you',
                'you': 'I'
            };

        if (!params.target && !params.monster) {
            params.target = 'me';
        }

        if (params.target) {
            target = targetMap[params.target];
        } else if (params.monster) {
            target = `${tools.preposition(params.monster)} ${params.monster}`;
        }

        return target;
    },
    getMods: ({
        mods,
        target = 'you'
    }) => {
        let output = [];
        if (mods.againstTarget) {
            if (mods.againstTarget.advantage) {
                output.push(`${mods.againstTarget.advantage} rolls have advantage against ${target}`);

            }
            if (mods.againstTarget.disadvantage) {
                output.push(`${mods.againstTarget.disadvantage} rolls have disadvantage against ${target}`);

            }
        }
        if (mods.byTarget) {
            if (mods.byTarget.advantage) {
                output.push(`${target} have advantage on ${mods.byTarget.advantage} rolls `);

            }
            if (mods.byTarget.disadvantage) {
                output.push(`${target} have disadvantage on ${mods.byTarget.disadvantage} rolls `);

            }
        }

        output = tools.listing({
            str: output
        });

        return output;
    }
};

exports = module.exports = tools;