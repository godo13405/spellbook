'use strict';

const router = require('./_router.js'),
    http = require('http'),
    fs = require('fs');
let chalk;
if (global.isDev) {
    chalk = require('chalk');
}

const serve = {
    api: (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let body = [];
        req.on('error', err => {
            // eslint-disable-next-line no-console
            if (global.isDev) console.error(chalk.red(err));
        }).on('data', chunk => {
            body.push(chunk);
        }).
        on('end', () => {
            body = JSON.parse(Buffer.concat(body).toString());
            res.end(router.ready(body));
        });
    },
    // eslint-disable-next-line max-lines-per-function
    static: (req, res) => {
        let filePath = `.${req.url}`;
        if (filePath === './') {
            filePath = './demo/docs/index.html';
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
        let output = 'text/html';
        switch (input) {
            case 'js':
                output = 'text/javascript';
                break;
            case 'css':
                output = 'text/css';
                break;
            case 'json':
                output = 'application/json';
                break;
            case 'svg':
                output = 'image/svg+xml';
                break;
            case 'png':
                output = 'image/png';
                break;
            case 'jpg':
                output = 'image/jpg';
                break;
            case 'wav':
                output = 'audio/wav';
                break;
            default:
                break;
        }

        return output;
    },
    bridge: ({
        projectId = 'spellbook-7ccae',
        sessionId = '*',
        body = {
            "queryInput": {
                "text": {
                    "languageCode": "en",
                    "text": "what is fireball"
                }
            }
        },
        postOptions = {
            host: 'https://dialogflow.googleapis.com/',
            port: '80',
            path: `/v2beta1/projects/${projectId}/agent/sessions/${sessionId}:detectIntent`,
            method: 'POST',
            body,
            headers: {
                'auth': ')6@9npt?Fwgp={V',
                'Authorization': 'Bearer 0d4b7dfb0d104d94abb64ce45d2054f7',
                'Accept': 'application/json',
                'Accept': 'application/json'
            }
        }
    }) => {
        return http.request(postOptions, res => {
            res.setEncoding('utf8');
            res.on('data', chunk => {
                console.log('Response: ', chunk);
            });
        });
    }
};

exports = module.exports = serve;