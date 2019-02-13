'use strict';

// Options
global.verbose = true;
global.randomPhrasing = true;

const router = require('./JS/_router.js'),
    http = require('http'),
    port = 8080,
    server = http.createServer();

server.on('request', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    let body = [];
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = JSON.parse(Buffer.concat(body).toString());
        res.end(router.ready(body));
    });
})
.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
