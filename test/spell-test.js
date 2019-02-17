'use strict';

/* eslint-disable max-lines-per-function */
/* eslint-disable no-unused-expressions */
/* global describe, it */

const assert = require('assert'),
    router = require('../JS/_router.js'),
    testTools = require('./_test-tools.js');

// Options
global.verbose = false;
global.randomPhrasing = false;

describe('Get spell', () => {
    describe('init', () => {
        it('describe', () => {
            const req = new testTools.Req().request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball is a level 3 spell, which does 8d6 fire damage");
        });
        it('cantrip', () => {
            const req = new testTools.Req().
            name('spell', 'acid splash').
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Acid Splash is a cantrip, which does 1d6 acid damage");
        });
    });
    describe('damage', () => {
        it('yes', () => {
            const req = new testTools.Req().
            action("get.spell.damage").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball does 8d6 fire damage");
        });
        it('no', () => {
            const req = new testTools.Req().
            action("get.spell.damage").
            name('spell', 'bane').
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Bane does no damage");
        });
    });
    describe('casting time', () => {
        it('describe', () => {
            const req = new testTools.Req().
            action("get.spell.castingTime").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball takes 1 action to cast");
        });
    });
    describe('duration', () => {
        it('instantaneous', () => {
            const req = new testTools.Req().
            action("get.spell.duration").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball is instantaneous");
        });
        it('describe', () => {
            const req = new testTools.Req().
            action("get.spell.duration").
            name("spell", "feign death").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Feign Death lasts for 1 hour");
        });
    });
    describe('components', () => {
        it('describe M, S, V', () => {
            const req = new testTools.Req().
            action("get.spell.components").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball needs some materials, an incantation, and gesturing");
        });
        it('describe S, V', () => {
            const req = new testTools.Req().
            action("get.spell.components").
            name("spell", "dispel magic").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Dispel Magic needs an incantation, and gesturing");
        });
        it('describe M, S', () => {
            const req = new testTools.Req().
            action("get.spell.components").
            name("spell", "hypnotic pattern").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Hypnotic Pattern needs some materials, and gesturing");
        });
        it('describe V', () => {
            const req = new testTools.Req().
            action("get.spell.components").
            name("spell", "mass healing word").
            request;
            req.queryResult.parameters.spell = ["mass healing word"];
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Mass Healing Word needs an incantation");
        });
    });
    describe('materials', () => {
        it('yes', () => {
            const req = new testTools.Req().
            action("get.spell.materials").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball requires a tiny ball of bat guano and sulfur");
        });
        it('no', () => {
            const req = new testTools.Req().
            action("get.spell.materials").
            name("spell", "dispel magic").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Dispel Magic doesn't require any materials");
        });
    });
});
describe('Check spell', () => {
    describe('ritual', () => {
        it('no', () => {
            const req = new testTools.Req().
            action("check.spell.ritual").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "No, Fireball can't be cast as a ritual");
        });
        it('yes', () => {
            const req = new testTools.Req().
            action("check.spell.ritual").
            name("spell", "commune with nature").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Yes, Commune with Nature can be cast as a ritual");
        });
    });
    describe('concentration', () => {
        it('no', () => {
            const req = new testTools.Req().
            action("check.spell.concentration").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball doesn't need concentration");
        });
        it('yes', () => {
            const req = new testTools.Req().
            action("check.spell.concentration").
            name("spell", "delayed blast fireball").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Delayed Blast Fireball needs you fo concentrate on it");
        });
    });
    describe('classes', () => {
        it('list', () => {
            const req = new testTools.Req().
            action("get.spell.classes").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball can be cast by sorcerers, and wizards");
        });
        it('single', () => {
            const req = new testTools.Req().
            action("get.spell.classes").
            name('spell', 'elemental weapon').
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Elemental Weapon can only be cast by paladins");
        });
    });
});