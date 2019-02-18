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
            assert.strictEqual(output.fulfillmentText, "Fireball is a level 3 Evocation spell, which does 8d6 fire damage");
        });
        it('cantrip', () => {
            const req = new testTools.Req().
            name('spell', 'acid splash').
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Acid Splash is a Conjuration cantrip, which does 1d6 acid damage");
        });
    });
    describe('damage', () => {
        it('yes', () => {
            const req = new testTools.Req().
            action("spell.get.damage").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball does 8d6 fire damage");
        });
        it('no', () => {
            const req = new testTools.Req().
            action("spell.get.damage").
            name('spell', 'bane').
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Bane does no damage");
        });
        it('follow-up', () => {
            const req1 = new testTools.Req().
            name('spell', 'bane').
            request;
            const step = JSON.parse(router.ready(req1));
            const req2 = new testTools.Req(step.outputContexts).
            action("spell.get.damage").
            name('spell', '').
            request;
            const output = JSON.parse(router.ready(req2));
            assert.strictEqual(output.fulfillmentText, "Bane does no damage");
        });
    });
    describe('casting time', () => {
        it('describe', () => {
            const req = new testTools.Req().
            action("spell.get.castingTime").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball takes 1 action to cast");
        });
    });
    describe('duration', () => {
        it('instantaneous', () => {
            const req = new testTools.Req().
            action("spell.get.duration").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball is instantaneous");
        });
        it('describe', () => {
            const req = new testTools.Req().
            action("spell.get.duration").
            name("spell", "feign death").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Feign Death lasts for 1 hour");
        });
    });
    describe('components', () => {
        it('describe M, S, V', () => {
            const req = new testTools.Req().
            action("spell.get.components").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball needs some materials, an incantation, and gesturing");
        });
        it('describe S, V', () => {
            const req = new testTools.Req().
            action("spell.get.components").
            name("spell", "dispel magic").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Dispel Magic needs an incantation, and gesturing");
        });
        it('describe M, S', () => {
            const req = new testTools.Req().
            action("spell.get.components").
            name("spell", "hypnotic pattern").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Hypnotic Pattern needs some materials, and gesturing");
        });
        it('describe V', () => {
            const req = new testTools.Req().
            action("spell.get.components").
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
            action("spell.get.materials").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball requires a tiny ball of bat guano and sulfur");
        });
        it('no', () => {
            const req = new testTools.Req().
            action("spell.get.materials").
            name("spell", "dispel magic").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Dispel Magic doesn't require any materials");
        });
    });
    describe('classes', () => {
        it('list', () => {
            const req = new testTools.Req().
            action("spell.get.classes").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball can be cast by Sorcerers, and Wizards");
        });
        it('single', () => {
            const req = new testTools.Req().
            action("spell.get.classes").
            name('spell', 'elemental weapon').
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Elemental Weapon can only be cast by Paladins");
        });
    });
    describe('school', () => {
        it('list', () => {
            const req = new testTools.Req().
            action("spell.get.school").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball is an Evocation");
        });
    });
    describe('description', () => {
        it('describe', () => {
            const req = new testTools.Req().
            action("spell.get.description").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "When casting Fireball, a bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes **8d6 fire damage** on a failed save, or half as much damage on a successful one.<break time='200ms'/> The fire spreads around corners. It ignites flammable objects in the area that aren't being worn or carried.");
        });
    });
});


describe('Check spell', () => {
    describe('ritual', () => {
        it('no', () => {
            const req = new testTools.Req().
            action("spell.check.ritual").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "No, Fireball can't be cast as a ritual");
        });
        it('yes', () => {
            const req = new testTools.Req().
            action("spell.check.ritual").
            name("spell", "commune with nature").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Yes, Commune with Nature can be cast as a ritual");
        });
    });
    describe('concentration', () => {
        it('no', () => {
            const req = new testTools.Req().
            action("spell.check.concentration").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Fireball doesn't need concentration");
        });
        it('yes', () => {
            const req = new testTools.Req().
            action("spell.check.concentration").
            name("spell", "delayed blast fireball").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Delayed Blast Fireball needs you fo concentrate on it");
        });
    });
    describe('classes', () => {
        it('yes', () => {
            const req = new testTools.Req().
            action("spell.check.classes").
            name("class", "wizard").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "Yes, Fireball can cast by Wizards");
        });
        it('no', () => {
            const req = new testTools.Req().
            action("spell.check.classes").
            name("class", "bard").
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "No, Bards can't cast Fireball");
        });
    });
});