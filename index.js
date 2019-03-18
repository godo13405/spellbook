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
    console.log('req:', Object.keys(req));
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    // API call
    if (req.method === 'POST' && req.headers.auth === ')6@9npt?Fwgp={V') {
        serve.api(req, res);
    } else {
        const url = urlParser.parse(req.url);
        console.log('url:', url);
        switch (url.pathname) {
            case '/bridge':
                serve.bridge({
                    req,
                    res,
                    url
                });
                break;
            default:
                // Demo
                serve.static(req, res);
                break;
        }
    }
}).listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at port ${port}`);
});