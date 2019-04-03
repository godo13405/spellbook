'use strict';

const options = require('../_globalOptions.js');

const spell = require('./_spellTools.js'),
    tools = {
        context: ({
            output,
            req
        }) => {
            output.outputContexts = req.queryResult.outputContexts || [];
            // output.outputContexts = [];
            // let pars = {};
            // if (req.queryResult.parameters) {
            //     for (const x in req.queryResult.parameters) {
            //         if (options.contextsClear[x]) {
            //             // is this a context we want to clear?
            //             if (req.queryResult.outputContexts) {
            //                 req.queryResult.outputContexts.forEach(y => {
            //                     const name = tools.contextNameGet(y.name);
            //                     if (options.contextsClear[x] && !options.contextsClear[x].includes(name)) {
            //                         console.log(options.contextsClear[x], `${x} means keeping ${name} context`);
            //                         if (y.parameters[`${name}_internal`]) pars[name] = y.parameters[`${name}_internal`];
            //                     }
            //                 });
            //             }

            //             if (req.queryResult.parameters[x]) pars[x] = req.queryResult.parameters[x];
            //         }
            //     }
            // }

            // console.log('pars:', pars);
            for (const x in req.queryResult.parameters) {
                const contextName = tools.contextNameSet({
                    session: req.session,
                    name: x
                });

                // prepare new context entry
                let data = {
                    "name": contextName,
                    lifespanCount: 1,
                    "parameters": {}
                };
                data.parameters[`${x}_internal`] = req.queryResult.parameters[x];

                output.outputContexts.push(data);
            }

            console.log('output:', output);
            return output;
        },
        contextNameSet: ({
            session,
            name
        }) => {
            return `${session}/contexts/${name}_internal`;
        },
        contextNameGet: name => {
            if (name.includes('/')) {
                name = name.split('/');
                name = name[name.length - 1];
                name = name.substring(0, name.indexOf('_'));
            }
            return name;
        },
        suggestions: ({
            suggestions,
            output,
            client = global.client
        }) => {
            if (suggestions) {
                if (client.name === 'google' && client.capabilities.includes('screen')) {
                    output.payload.google.richResponse.suggestions = [];
                    suggestions.forEach(x => {
                        output.payload.google.richResponse.suggestions.push({
                            "title": x
                        });
                    });
                }
            }
            return output;
        },
        card: subject => {

            /*
             * let output = [{
             *     "buttons": [{
             *         "postback": "Card Link URL or text",
             *         "text": "Card Link Title"
             *     }],
             *     "imageUrl": "http://urltoimage.com",
             *     "platform": "facebook",
             *     "subtitle": "Card Subtitle",
             *     "title": "Card Title",
             *     "type": 1
             * }]
             */
            let output = {
                "basicCard": {
                    "title": subject.name,
                    "subtitle": spell.subtitle(subject, false),
                    "formattedText": subject.description,
                }
            };

            if (subject.image) {
                output.image = {
                    "url": subject.image.url,
                    "accessibilityText": subject.image.alt || subject.name
                };
                output.imageDisplayOptions = "CROPPED";
            }

            /*
             * output.buttons = [{
             *     "title": "This is a button",
             *     "openUrlAction": {
             *         "url": "https://assistant.google.com/"
             *     }
             * }];
             */

            return output;
        },
        slack: {
            card: ({
                subject,
                req,
                output,
                txt
            }) => {
                if (req.originalDetectIntentRequest &&
                    req.originalDetectIntentRequest.payload &&
                    req.originalDetectIntentRequest.payload.data &&
                    req.originalDetectIntentRequest.payload.data.event &&
                    req.originalDetectIntentRequest.payload.data.event.channel) {
                    output.payload.slack = {
                        "channel": req.originalDetectIntentRequest.payload.data.event.channel,
                        "text": txt,
                        "blocks": [{
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": txt
                            }
                        }]
                    };

                    if (subject.suggestions) {
                        subject.suggestions.forEach(x => {
                            output.payload.slack.blocks.push({
                                "type": "actions",
                                "elements": [{
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": x,
                                        "emoji": false
                                    },
                                    "value": x
                                }]
                            });
                        });
                    }
                }
                return output;
            }
        },
        capabilities: raw => {
            let output = [];
            const capabilities = {
                "actions.capability.WEB_BROWSER": "web",
                "actions.capability.AUDIO_OUTPUT": "audio",
                "actions.capability.MEDIA_RESPONSE_AUDIO": "audio",
                "actions.capability.SCREEN_OUTPUT": "screen",
            }
            if (raw.source === 'google') {
                raw.payload.surface.capabilities.forEach(x => {
                    if (capabilities[x.name] && !output[capabilities[x.name]]) {
                        output.push(capabilities[x.name]);
                    }
                });
            }
            return output;
        }
    };

exports = module.exports = tools;