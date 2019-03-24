'use strict';

const serve = require('./JS/_serve.js');

exports.dragonBook = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');

    let output;
    if (req.method === 'POST') {
        // API call
        output = serve.api(req.body);
        console.log('JSON.stringify(output):', JSON.stringify(output));
        res.end(JSON.stringify(output));
    }
}