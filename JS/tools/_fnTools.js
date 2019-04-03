'use strict';

// Options
const options = require('../_globalOptions.js'),
    respondTools = require('../tools/_respondTools.js');

const tools = {
    randSpell: (data = require('../../data/spell.json')) => {
        const keys = Object.keys(data);
        return data[keys[Math.floor(Math.random() * keys.length)]].name;
    },
    checkContext: ({
        contexts,
        params,
        intent
    }) => {
        if (contexts) {
            const action = intent.split('_')[0];
            for (const x of contexts) {
                const name = respondTools.contextNameGet(x.name);
                if (!params[name] && options.contextsClear[name] && !options.contextsClear[name].includes(action)) {
                    params[name] = x.parameters[`${name}_internal`];
                }
            }
        }

        console.log('params:', params);
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