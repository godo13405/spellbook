'use strict';

const router = require('./_router.js'),
    fs = require('fs');
let chalk;
if (global.isDev) {
    chalk = require('chalk');
}

const serve = {
    api: body => {
        return router.ready(body);
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