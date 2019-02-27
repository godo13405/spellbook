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

describe('Get weapon', () => {
    describe('init', () => {
        it('single damage', () => {
            const req = new testTools.Req().
            action('weapon.get.init').
            name('weapon', 'club').
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "A club is a simple melee weapon, which causes 1d4 bludgeoning damage");
        });
        it('versatile', () => {
            const req = new testTools.Req().
            action('weapon.get.init').
            name('weapon', 'trident').
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "A trident is a martial melee weapon, which causes 1d6, or 1d8 piercing damage");
        });
    });
    describe('damage', () => {
        it('single damage', () => {
            const req = new testTools.Req().
            action('weapon.get.damage').
            name('weapon', 'club').
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "A club causes 1d4 bludgeoning damage");
        });
        it('versatile', () => {
            const req = new testTools.Req().
            action('weapon.get.damage').
            name('weapon', 'trident').
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "A trident causes 1d6, or 1d8 piercing damage, if 2 handed");
        });
    });
    describe('price', () => {
        it('single coin', () => {
            const req = new testTools.Req().
            action('weapon.get.price').
            name('weapon', 'club').
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "A club costs a silver coin");
        });
        it('multiple coins', () => {
            const req = new testTools.Req().
            action('weapon.get.price').
            name('weapon', 'trident').
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "A trident costs 5 gold coins");
        });
    });
});