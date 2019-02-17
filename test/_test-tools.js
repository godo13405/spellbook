'use strict';

/* eslint-disable space-before-function-paren */

const router = require('../JS/_router.js');

const testTools = {
    Req: class {
        constructor(contexts) {
            this.request = {
                "queryResult": {
                    "action": "get.spell.init",
                    "parameters": {
                        "spell": [
                            "fireball"
                        ]
                    },
                    "outputContexts": contexts
                }
            };
            this.contexts = contexts;
        }

        action(action) {
            this.request.queryResult.action = action;
            return this;
        }

        name(name, value) {
            this.request.queryResult.parameters[name] = [value];
            return this;
        }
    },
    copy: src => {
        return JSON.parse(JSON.stringify(src));
    },
    process: input => {
        if (!input) {
            input = testTools.setRequest();
        }
        return JSON.parse(router.ready(input));
    },
    setRequest: req => {
        let output = {
            "queryResult": {
                "action": "get.spell.init",
                "parameters": {
                    "spell": [
                        "fireball"
                    ]
                }
            }
        };

        if (req) {
            output = Object.assign(req, output);
        }

        return output;
    }
};

exports = module.exports = testTools;