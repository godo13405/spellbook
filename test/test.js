'use strict';

const assert = require('assert'),
    router = require('../JS/_router.js');

// Options
global.verbose = false;
global.randomPhrasing = false;

const reqRaw = {
    "queryResult": {
        "queryText": "what is fireball",
        "action": "get.spell.init",
        "parameters": {
            "spell": [
                "fireball"
            ]
        }
    }
};


describe('Spell', function () {
    describe('init', function () {
            it('short spell description', function () {
                const output = JSON.parse(router.ready(reqRaw));
                assert.strictEqual(output.fulfillmentText, "Fireball is a level 3 spell, which does 8d6 fire damage");
            });
        }),
        describe('damage', function () {
            it('describe the damage it does', function () {
                let req = reqRaw;
                req.queryResult.action = "get.spell.damage";
                const output = JSON.parse(router.ready(req));
                assert.strictEqual(output.fulfillmentText, "Fireball does 8d6 fire damage");
            });
            it('does no damage', function () {
                let req = reqRaw;
                req.queryResult.action = "get.spell.damage";
                req.queryResult.parameters.spell = ["bane"];
                const output = JSON.parse(router.ready(req));
                assert.strictEqual(output.fulfillmentText, "Bane does no damage");
            });
        })
});