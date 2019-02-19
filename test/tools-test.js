'use strict';

/* eslint-disable max-lines-per-function */
/* eslint-disable no-unused-expressions */
/* global describe, it */

const assert = require('assert'),
    tools = require('../JS/_tools.js');

// Options
global.verbose = false;
global.randomPhrasing = false;

describe('Tools', () => {
    describe('preposition', () => {
        it('a', () => {
            let output = tools.preposition('Fireball');
            assert.strictEqual(output, "a");
        });
    });
});