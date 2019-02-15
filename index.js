'use strict';

// Options
// eslint-disable-next-line no-unused-vars
const options = require('./JS/_globalOptions.js');

const router = require('./JS/_router.js'),
    http = require('http'),
    port = process.env.PORT || 8080,
    server = http.createServer();

server.on('request', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    let body = [];
    req.on('error', err => {
        console.error(err);
    }).on('data', chunk => {
        body.push(chunk);
    }).
    on('end', () => {
        body = JSON.parse(Buffer.concat(body).toString());
        res.end(router.ready(body));
    });
}).
listen(port, () => {
    console.log(`Server running at port ${port}`);
});