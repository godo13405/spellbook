'use strict';

const serve = require('./JS/_serve.js'),
    urlParser = require('url');

exports.dragonBook = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Type', 'application/json');

    const url = urlParser.parse(req.url);
    let output;
    if (req.method === 'POST' && req.headers.auth === ')6@9npt?Fwgp={V') {
        // API call
        output = serve.api(req.body);
        res.end(JSON.stringify(output));
    } else if (url.pathname === '/bridge') {
        // Bridge for apps to consume (Alexa, etc)
        output = serve.bridge({
            req: req.body,
            url
        }).
        then(x => {
            res.end(x);
        });
    }
}