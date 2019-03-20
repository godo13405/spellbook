'use strict';

const serve = require('./JS/_serve.js');

exports.dragonBook = (req, res) => {
    console.log('req.body:', req.body);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    let output;
    if (req.method === 'POST' && req.headers.auth === ')6@9npt?Fwgp={V') {
        // API call
        output = serve.api(req.body);
        res.end(JSON.stringify(output));
    }
}