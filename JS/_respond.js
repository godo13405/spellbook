'use strict';

const tools = require('./tools/_tools.js');

// eslint-disable-next-line max-lines-per-function
const respond = ({
  data
}) => {
  const txt = tools.text.stripSsml(data.data || data.speech),
    speech = tools.fn.sound(data.speech || data.data, data.audio);
  let output = {
    "fulfillmentText": data.data,
    "fulfillmentMessages": [{
        "platform": "ACTIONS_ON_GOOGLE",
        "simpleResponses": {
          "simpleResponses": [{
            // "textToSpeech": speech,
            "ssml": `<speak>${speech}</speak>`,
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

  /*
   * Contexts
   * for (const x in req.queryResult.parameters) {
   *   output = tools.respond.context({
   *     output,
   *     req,
   *     contextName: x,
   *     context: req.queryResult.parameters[x]
   *   });
   * }
   */


  // Suggestions
  output = tools.respond.suggestions({
    suggestions: data.suggestions,
    output
  });
  return JSON.stringify(output);
};

exports = module.exports = respond;