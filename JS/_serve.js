'use strict';

const router = require('./_router.js'),
    respond = require('./_respond.js'),
    https = require('https'),
    fs = require('fs');
let chalk;
if (global.isDev) {
    chalk = require('chalk');
}

const serve = {
    api: body => {
        router.ready(body);
    },
    // eslint-disable-next-line max-lines-per-function
    static: (req, res) => {
        let filePath = `.${req.url}`;
        if (filePath === './') {
            filePath = './docs/demo/index.html';
        } else if (filePath === './favicon.ico') {
            filePath = './docs/demo/fav/favicon.ico';
        }

        fs.readFile(filePath, (error, content) => {
            if (error) {
                // eslint-disable-next-line no-console
                if (global.isDev) console.log(chalk.red('invalid URL'), chalk.blue(filePath));
            }
            res.setHeader('Content-Type', serve.getContentType(req.url));
            res.end(content, 'utf-8');
        });
    },
    getContentType: input => {
        input = input.split('.');
        input = input[input.length - 1];
        let output = 'text/html',
            types = {
                'js': 'text/javascript',
                'css': 'text/css',
                'json': 'application/json',
                'svg': 'image/svg+xml',
                'png': 'image/png',
                'jpg': 'image/jpg',
                'wav': 'audio/wav',
                'ico': 'image/x-icon'
            };
        if (types[input]) output = types[input];
        return output;
    },
    bridge: ({
        args = {
            "method": "POST",
            "hostname": "dialogflow.googleapis.com",
            "path": `/v2beta1/projects/spellbook-7ccae/agent/sessions/*:detectIntent?alt=json`,
            "headers": {
                "Authorization": `Bearer ${process.env.TOKEN}`,
                "auth": ")6@9npt?Fwgp={V",
                "Accept": "application/json",
                "cache-control": "no-cache",
                "Content-Type": "application/json"
            }
        },
        url,
        q = serve.getText({
            url
        }),
        body
    }) => {
        // identify the client
        let client = {
            name: 'bridge'
        };
        if (body.session && body.session.sessionId.includes('amzn1.echo-api.session')) {
            // TO DO expand with capabilities
            client.name = 'alexa';

            // translate requests into dialigflow
            if (body.request.type === 'LaunchRequest') {
                q = 'hi';
            } else if (body.request.type === 'SessionEndedRequest') {
                q = 'stop';
            }
        }


        let output = new Promise(resolve => {
            let request = https.request(args, response => {
                let chunks = [];

                response.on("data", chunk => {
                    chunks.push(chunk);
                });

                response.on("end", () => {
                    chunks = Buffer.concat(chunks).toString();
                    console.log('response: ', JSON.parse(chunks));
                    if (!respond[client.name]) {
                        // eslint-disable-next-line no-console
                        console.log(`I don't know how to build a response for ${client.name}`);
                    } else {
                        resolve(respond[client.name]({
                            data: chunks,
                            req: request
                        }));
                    }
                });
            })

            request.write(JSON.stringify({
                queryInput: {
                    text: {
                        languageCode: 'en',
                        text: q
                    }
                }
            }));

            request.end();
        });

        return output;
    },
    getText: ({
        q,
        url
    }) => {
        if (url.query) {
            q = decodeURI(url.query.substr(2));
        }
        return q;
    }
};

exports = module.exports = serve;