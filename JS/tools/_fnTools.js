'use strict';

// Options
// eslint-disable-next-line no-unused-vars
const options = require('../_globalOptions.js');

const tools = {
    randSpell: (data = require('../../data/spell.json')) => {
        const keys = Object.keys(data);
        return data[keys[Math.floor(Math.random() * keys.length)]].name;
    },
    checkContext: ({
        params,
        contexts
    }) => {
        const contextsMap = [
            "spell",
            "weapon"
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
    intent: action => {
        let parts = action.split('_'),
            intent = {
                raw: action,
                entity: parts[0],
                action: parts[1],
                function: parts[2],
            };

        intent.fn = require(`../_${intent.entity}.js`);

        return intent;
    },
    clone: obj => {
        return JSON.parse(JSON.stringify(obj));
    },
    sound: (input, audio) => {
        let output = input;
        if (audio) {
            if (Array.isArray(audio)) {
                audio = audio[Math.floor(Math.random() * audio.length)];
            }

            output += `<audio src="${audio}"/>`;
            if (audio.offset) {
                output = `<par><media xml:id="response" begin="0"><speak>${input}</speak></media><media xml:id="sfx" begin="response.end${audio.offset}s"><audio src="${audio.url}" /></media></par>`;
            }
        }

        return output;
    }
};

exports = module.exports = tools;