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
        const intent = {
                raw: req.queryResult.action,
                action: req.queryResult.action.split('.')[0],
                entity: req.queryResult.action.split('.')[1],
                function: req.queryResult.action.split('.')[2]
            },
            // params = req.queryResult.parameters,
            params = tools.checkContext({
                params: req.queryResult.parameters,
                contexts: req.queryResult.outputContexts
            }),
            fn = require(`./_${intent.entity}.js`);

        let functionToRun = intent.function;

        if (!fn[functionToRun]) {
            functionToRun = 'init';
        }


        output = fn[functionToRun]({
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