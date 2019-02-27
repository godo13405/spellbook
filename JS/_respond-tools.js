'use strict';

const tools = require('./_tools.js');

const respondTools = {
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
    }
};

exports = module.exports = respondTools;