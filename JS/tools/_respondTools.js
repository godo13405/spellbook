'use strict';

const spell = require('./_spellTools.js'),
    tools = {
        context: ({
            output,
            req,
            contextName = 'spell',
            context = ''
        }) => {
            // Things to remember for this session

            const contextFullName = `${req.session}/contexts/${contextName}_internal`;

            // Are there any contexts we should keep?
            if (!req.outputContexts) {
                output.outputContexts = [];
            } else {
                output.outputContexts = req.outputContexts;
            }

            // Is this context there already?
            output.outputContexts.filter(x => {
                return x.name !== contextFullName;
            });

            let data = {
                "name": contextFullName,
                "lifespanCount": 5,
                "parameters": {}
            };

            data.parameters[`${contextName}_internal`] = context;
            output.outputContexts.push(data);

            return output;
        },
        suggestions: ({
            suggestions,
            output
        }) => {
            if (suggestions) {
                let sugg = {
                    "platform": "ACTIONS_ON_GOOGLE",
                    "suggestions": {
                        "suggestions": []
                    }
                };
                suggestions.forEach(x => {
                    sugg.suggestions.suggestions.push({
                        "title": x
                    });
                });
                output.fulfillmentMessages.push(sugg);
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
        }
    };

exports = module.exports = tools;