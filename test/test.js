/* eslint-disable max-lines-per-function */
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
        it('describe', () => {
            const output = JSON.parse(router.ready(reqRaw));
            assert.strictEqual(output.fulfillmentText, "Fireball is a level 3 spell, which does 8d6 fire damage");
        });
    });
    describe('damage', () => {
        it('yes', () => {
            let req = reqRaw;
            req.queryResult.action = "get.spell.damage";
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball does 8d6 fire damage");
        });
        it('no', () => {
            let req = testTools.copy(reqRaw);
            req.queryResult.action = "get.spell.damage";
            req.queryResult.parameters.spell = ["bane"];
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Bane does no damage");
        });
    });
    describe('casting time', () => {
        it('describe', () => {
            let req = testTools.copy(reqRaw);
            req.queryResult.action = "get.spell.castingTime";
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball takes 1 action to cast");
        });
    });
    describe('ritual', () => {
        let req = testTools.copy(reqRaw);
        req.queryResult.action = "check.spell.ritual";
        it('no', () => {
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "No, Fireball can't be cast as a ritual");
        });
        it('yes', () => {
            req.queryResult.parameters.spell = ["commune with nature"];
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Yes, Commune with Nature can be cast as a ritual");
        });
    });
    describe('duration', () => {
        let req = testTools.copy(reqRaw);
        req.queryResult.action = "get.spell.duration";
        it('instantaneous', () => {
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball is instantaneous");
        });
        it('describe', () => {
            req.queryResult.parameters.spell = ["feign death"];
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Feign Death lasts for 1 hour");
        });
    });
    describe('concentration', () => {
        let req = testTools.copy(reqRaw);
        req.queryResult.action = "check.spell.concentration";
        it('no', () => {
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball doesn't need concentration");
        });
        it('yes', () => {
            req.queryResult.parameters.spell = ["delayed blast fireball"];
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Delayed Blast Fireball needs you fo concentrate on it");
        });
    });
});