'use strict';

const respond = require('./_respond.js');
const tools = require('./_tools.js');
let chalk;
if (global.isDev) {
    chalk = require('chalk');
}

const router = {
    ready: req => {
        // Don't listen to all events on Slack, only DMs and direct mentions
        if (!req.originalDetectIntentRequest || req.originalDetectIntentRequest.source !== 'slack' ||
            (req.originalDetectIntentRequest.payload.data.event.channel_type === 'im' ||
                (req.originalDetectIntentRequest.payload.data.event.channel_type !== 'im' && req.originalDetectIntentRequest.payload.data.event.text.includes(`<@${req.originalDetectIntentRequest.payload.data.authed_users[0]}>`))
            )
        ) {
            let output = 'Sorry, something went wrong';
            const params = tools.checkContext({
                    params: req.queryResult.parameters,
                    contexts: req.queryResult.outputContexts
                }),
                intent = tools.intent(req.queryResult.action);

            output = intent.fn[intent.action][intent.function]({
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
            // eslint-disable-next-line no-else-return
        } else if (global.isDev) {
            // eslint-disable-next-line no-console
            console.log(chalk.red('not listening for this'), req.originalDetectIntentRequest.payload.data.authed_users[0]);
        }
    }
};

exports = module.exports = router;