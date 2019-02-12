'use strict';

const router = require('./JS/_router.js');

const http = require('http');

const port = 8080;

const server = http.createServer();
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
