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

describe('Get condition', () => {
    describe('init', () => {
        it('basic description', () => {
            const req = new testTools.Req().
            action('condition.get.init').
            name('condition', 'blinded').
            request;
            const output = JSON.parse(router.ready(req));
            assert.strictEqual(output.fulfillmentText, "When blinded, you can't see and automatically fail any ability check that requires sight. Attack rolls have advantage against you, and you have disadvantage on attack rolls");
        });
    });
});