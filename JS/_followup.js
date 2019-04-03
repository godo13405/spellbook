'use strict';

const tools = require('./tools/_tools.js'),
    followup = {
        get: {
            damage: ({
                intent,
                params
            }) => {
                console.log('follow-up params:', params);
                let fn;
                if (params.spell) {
                    intent = tools.fn.intent('spell_get_damage');
                    fn = require('./_spell.js');
                } else if (params.weapon) {
                    intent = tools.fn.intent('weapon_get_damage');
                    fn = require('./_weapon.js');
                }
                return fn.get.damage({
                    intent,
                    params
                });

            }
        }
    };

exports = module.exports = followup;