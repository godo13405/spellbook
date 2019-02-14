'use strict';

/* eslint-disable no-unused-expressions */
/* global describe, it */

const assert = require('assert'),
    router = require('../JS/_router.js'),
    testTools = require('./_test-tools.js');

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


describe('Spell', () => {
    describe('init', () => {
        it('short spell description', () => {
            const output = JSON.parse(router.ready(reqRaw));
            assert.strictEqual(output.fulfillmentText, "Fireball is a level 3 spell, which does 8d6 fire damage");
        });
    });
    describe('damage', () => {
        it('describe the damage it does', () => {
            let req = reqRaw;
            req.queryResult.action = "get.spell.damage";
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball does 8d6 fire damage");
        });
        it('does no damage', () => {
            let req = testTools.copy(reqRaw);
            req.queryResult.action = "get.spell.damage";
            req.queryResult.parameters.spell = ["bane"];
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Bane does no damage");
        });
    });
    describe('casting time', () => {
        it('describe how long it takes to cast', () => {
            let req = testTools.copy(reqRaw);
            req.queryResult.action = "get.spell.castingTime";
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball takes 1 action to cast");
        });
    });
    describe('ritual', () => {
        it('check that it\'s not a ritual', () => {
            let req = testTools.copy(reqRaw);
            req.queryResult.action = "get.spell.isRitual";
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "No, Fireball can't be cast as a ritual");
        });
        it('check that it\'s a ritual', () => {
            let req = testTools.copy(reqRaw);
            req.queryResult.action = "get.spell.isRitual";
            req.queryResult.parameters.spell = ["commune with nature"];
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Yes, Commune with Nature can be cast as a ritual");
        });
    });
});