'use strict';

// Options
// eslint-disable-next-line no-unused-vars
const options = require('./JS/_globalOptions.js'),
    serve = require('./JS/_serve.js'),
    http = require('http'),
    port = 8080,
    server = http.createServer();

server.on('request', (req, res) => {
    res.statusCode = 200;
    // API call
    if (req.method === 'POST' && req.headers.auth === ')6@9npt?Fwgp={V') {
        serve.api(req, res);
        // Demo
    } else if (req.method === 'GET') {
        serve.static(req, res);
    }
}).listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at port ${port}`);
});