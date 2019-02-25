'use strict';

const router = require('./_router.js'),
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
    endpoint: ({
        projectId = 'spellbook-7ccae',
        sessionId = 'quickstart-session-id',
        languageCode = 'en',
        res,
        dialogflow = require('dialogflow')
    }) => {

        // Instantiate a DialogFlow client.
        const sessionClient = new dialogflow.SessionsClient();

        // Define session path
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);

        // The text query request.
        const request = {
            session: sessionPath,
            queryParams: {
                payload: {
                    source: 'web'
                }
            },
            queryInput: {
                text: {
                    text: 'hi',
                    languageCode: languageCode,
                }
            },
        };

        // Send request and log result
        request.queryInput.text.text = request.query.input;

        return sessionClient.
        detectIntent(request).
        then(response => {
            return res.json(response[0].queryResult);
        }).
        catch(err => {
            // eslint-disable-next-line no-console
            console.error('ERROR:', err);
        });
    }
};

exports = module.exports = serve;