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

describe('base', () => {
    it('welcome', () => {
        const req = new testTools.Req().
        action('base.input.welcome').
        request;
        const output = JSON.parse(router.ready(req));
        assert.strictEqual(output.fulfillmentText, "Hi! How are you doing?");
    });
});