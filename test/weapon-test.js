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
});