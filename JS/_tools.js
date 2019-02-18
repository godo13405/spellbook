'use strict';

// Options
// eslint-disable-next-line no-unused-vars
const options = require('./_globalOptions.js');

const spells = require('../data/spell.json');

const tools = {
    capitalize: txt => {
        if (typeof txt === 'string') {
            txt = txt.replace(/\b\w/g, l => l.toUpperCase());
        } else {
            // eslint-disable-next-line no-console
            console.log('\x1b[31m', 'What you tried to capitalize isn\'t a string', '\x1b[0m');
        }
        return txt;
    },
    preposition: txt => {
        const anLetters = [
            'a',
            'e',
            'i',
            'o'
        ];
        let output = 'a';
        if (anLetters.includes(txt.toLowerCase().substring(1))) {
            output = 'an';
        }

        return output;
    },
    stripSsml: txt => {
        return txt.replace(/<[a-zA-Z0-9s='"/]*>/g, '');
    },
    randSpell: (data = spells) => {
        const keys = Object.keys(data);
        return data[keys[Math.floor(Math.random() * keys.length)]].name;
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

        return output;
    },
    getPhrase: phrase => {
        return tools.phrasing.rand(tools.phrasing.find({
            phrase
        }));
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
                str = '<name>';
                str = tools.phrasing.tags({
                    str,
                    vars
                });
            }

            return str;
        },
        find: ({
            phrase,
            lib = require('../phrases.json'),
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
            } else {
                output = false;
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

            return str;
        }
    },
    listing: ({
        str,
        connector = 'and '
    }) => {
        let output = str[0];
        if (str.length > 1) {
            output = `${str.slice(0, -1).join(', ')}, ${connector}${str.slice(-1)}`;
        }

        return output;
    },
    checkContext: ({
        params,
        contexts
    }) => {
        const contextsMap = [
            "spell"
        ];
        if (contexts) {
            for (const x of contexts) {
                let name = x.name.split('/');
                name = name[name.length - 1];
                name = name.substring(0, name.indexOf('_'));
                if (contextsMap.includes(name)) {
                    if (!params[name] || params[name] !== '') {
                        params[name] = x.parameters[`${name}_internal`];

                        // If we're relying on a context, assume it's a follow up
                        global.followUp = true;
                    }
                }
            }
        }
        return params;
    },
};

exports = module.exports = tools;