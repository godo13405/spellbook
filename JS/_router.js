'use strict';

/* globals client */

const respond = require('./_respond.js'),
    tools = require('./tools/_tools.js'),
    options = require('./_globalOptions.js');

let chalk;
// if (global.isDev) {
chalk = require('chalk');
// }

const router = {
    ready: req => {
        // What client is this?
        global.client = router.client({
            req
        });
        // Don't listen to all events on Slack, only DMs and direct mentions
        if (!req.originalDetectIntentRequest || req.originalDetectIntentRequest.source !== 'slack' ||
            (req.originalDetectIntentRequest.payload.data.event.channel_type === 'im' ||
                // eslint-disable-next-line no-extra-parens
                (req.originalDetectIntentRequest.payload.data.event.channel_type !== 'im' && req.originalDetectIntentRequest.payload.data.event.text.includes(`<@${req.originalDetectIntentRequest.payload.data.authed_users[0]}>`))
            )
        ) {
            let output = 'Sorry, something went wrong',
                args = {},
                rawIntent;

            if (client.name === 'alexa') {
                rawIntent = req.request.type;
                if (rawIntent === 'SessionEndedRequest') {
                    rawIntent = 'base_session_end';
                } else {
                    rawIntent = 'base_input_welcome';
                    if (req.request.intent) {
                        rawIntent = req.request.intent.name;
                        if (req.request.intent.slots) {
                            // convert slots for processing
                            args.params = {};
                            for (const x in req.request.intent.slots) {
                                args.params[x.replace(/slot$/g, '')] = req.request.intent.slots[x].value;
                            }
                        }
                    }
                }
            } else {
                args = {
                    contexts: req.queryResult.outputContexts,
                    params: req.queryResult.parameters,
                    intent: req.queryResult.action
                };
                rawIntent = req.queryResult.action;
            }
            const params = tools.fn.checkContext(args),
                intent = tools.fn.intent(rawIntent);

            output = intent.fn[intent.action][intent.function]({
                intent,
                params
            });

            router.log({
                req,
                output,
                rawIntent
            });

            return respond[client.name]({
                data: output,
                req,
                continuous: options.continuousConversation.includes(intent.raw)
            });
            // eslint-disable-next-line no-else-return
        } else if (global.isDev) {
            // eslint-disable-next-line no-console
            console.log(chalk.red('not listening for this'), req.originalDetectIntentRequest.payload.data.authed_users[0]);
        }
    },
    client: ({
        client = {
            name: 'default'
        },
        req
    }) => {
        if (req.context && req.context.System && req.context.System.apiEndpoint.includes('amazonalexa.com')) {
            client.name = 'alexa';
        } else if (req.originalDetectIntentRequest) {
            if (req.originalDetectIntentRequest.source === 'google') {
                client.name = 'google';
                client.capabilities = tools.respond.capabilities(req.originalDetectIntentRequest);
            } else if (req.originalDetectIntentRequest.source === 'slack') {
                client.name = 'slack';
            }
        }

        return client;
    },
    log: ({
        req,
        output,
        rawIntent
    }) => {
        // if (isDev) {
        // eslint-disable-next-line no-console
        console.log(chalk.gray(rawIntent));
        // eslint-disable-next-line no-console
        if (req.queryResult && req.queryResult.queryText) console.log(chalk.blue('\u{1F914} ', req.queryResult.queryText));
        // eslint-disable-next-line no-console
        console.log('\u{1F916} ', chalk.green(output.data));
        // eslint-disable-next-line no-console
        if (output.suggestions) console.log(chalk.inverse(output.suggestions));
    }
};

exports = module.exports = router;