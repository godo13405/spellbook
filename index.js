'use strict';

// Options
// eslint-disable-next-line no-unused-vars
const options = require('./JS/_globalOptions.js'),
    serve = require('./JS/_serve.js'),
    http = require('http'),
    urlParser = require('url'),
    port = 8080,
    server = http.createServer();

server.on('request', (req, res) => {
    // console.log('req:', Object.keys(req), req);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const url = urlParser.parse(req.url);
    if (req.method === 'GET' && url.pathname === '/') {
        // Demo
        serve.static(req, res);
    } else {
        // process the request
        res.setHeader('Content-Type', 'application/json');
        let body = [];
        req.on('error', err => {
            // eslint-disable-next-line no-console
            if (global.isDev) console.error(err);
        }).on('data', chunk => {
            body.push(chunk);
        }).
        on('end', () => {
            if (body.length) {
                body = JSON.parse(Buffer.concat(body).toString());
                // console.log('body:', body);
            }
            let output;
            if (req.method === 'POST' && req.headers.auth === ')6@9npt?Fwgp={V') {
                // API call
                output = serve.api(body);
                res.end(JSON.stringify(output));
            } else if (url.pathname === '/bridge') {
                // Bridge for apps to consume (Alexa, etc)
                output = serve.bridge({
                    body,
                    url
                }).
                then(x => {
                    res.end(x);
                });
            }
        });

    }
}).listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at port ${port}`);
});