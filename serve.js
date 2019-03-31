'use strict';

// Options
// eslint-disable-next-line no-unused-vars
const endpoint = require('./index.js'),
    http = require('http'),
    port = 443,
    server = http.createServer();

server.on('request', (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        body = JSON.parse(body);
        endpoint.dragonBook({
            body
        }, res);
        res.end('ok');
    });
}).
listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at port ${port}`);
});