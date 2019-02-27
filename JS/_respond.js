'use strict';

const respondTools = require('./_respond-tools.js'),
  tools = require('./_tools.js');

// eslint-disable-next-line max-lines-per-function
const respond = ({
  data,
  req
}) => {
  const txt = tools.stripSsml(data.data || data.speech);
  let output = {
    "fulfillmentText": data.data,
    "fulfillmentMessages": [{
        "platform": "ACTIONS_ON_GOOGLE",
        "simpleResponses": {
          "simpleResponses": [{
            "textToSpeech": data.speech || data.data,
            "displayText": txt
          }]
        }
      },
      {
        "text": {
          "text": [
            txt
          ]
        }
      }
    ]
  };

  // Contexts
  for (const x in req.queryResult.parameters) {
    output = respondTools.context({
      output,
      req,
      contextName: x,
      context: req.queryResult.parameters[x]
    });
  }


  // Suggestions
  output = respondTools.suggestions({
    suggestions: data.suggestions,
    output
  });
  return JSON.stringify(output);
};

exports = module.exports = respond;