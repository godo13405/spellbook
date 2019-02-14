'use strict';

// Firstly, check whether the dev endpoint is active otherwise, fallback to Heroku
const isReachable = require('is-reachable');

// Options
// eslint-disable-next-line no-unused-vars
const options = require('./JS/_globalOptions.js');

const router = require('./JS/_router.js'),
    http = require('http'),
    port = 8080,
    server = http.createServer();

(async () => {
    const env = {
        prod: 'https://dragon-tome.herokuapp.com/',
        dev: 'https://spellbook.serveo.net'
    };
    const reach = await isReachable('spellbook.serveo.net:8080', {
        timeout: 50
    })
    if (reach) {
        http.createServer((request, response) => {
            const host = request.headers.host;
            if (host !== env.dev) {
                response.writeHead(302, {
                    Location: env.dev
                })
                response.end();
            }
        }).listen(3030);
    }
})();

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