'use strict';

const serve = require('./JS/_serve.js');

exports.dragonBook = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');

    let output = serve.api(req.body);
    res.end(JSON.stringify(output));
}