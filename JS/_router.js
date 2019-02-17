'use strict';

const respond = require('./_respond.js');
const tools = require('./_tools.js');
let chalk;
if (global.isDev) {
    chalk = require('chalk');
}

const router = {
    ready: req => {
        let output = 'Sorry, something went wrong';
        const parts = req.queryResult.action.split('.'),
            intent = {
                raw: req.queryResult.action,
                entity: parts[0],
                action: parts[1],
                function: parts[2]
            },
            params = tools.checkContext({
                params: req.queryResult.parameters,
                contexts: req.queryResult.outputContexts
            }),
            fn = require(`./_${intent.entity}.js`);

        output = fn[intent.action][intent.function]({
            intent,
            params
        });

        if (global.isDev) {
            // eslint-disable-next-line no-console
            console.log(chalk.gray(req.queryResult.action));
            // eslint-disable-next-line no-console
            console.log(chalk.green(output.data));
            // eslint-disable-next-line no-console
            console.log(chalk.inverse(output.suggestions));
        }

        return respond({
            data: output,
            req
        });
    }
};

exports = module.exports = router;