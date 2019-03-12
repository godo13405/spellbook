'use strict';

const tools = require('./tools/_tools.js');

// eslint-disable-next-line max-lines-per-function
const respond = ({
  data,
  req,
  continuous = false
}) => {
  const txt = tools.text.stripSsml(data.data || data.speech),
    speech = tools.fn.sound(data.speech || data.data, data.audio);
  let output = {
    "fulfillmentText": data.data,
    "fulfillmentMessages": [{
      "text": {
        "text": [
          txt
        ]
      }
    }],
    "payload": {
      "google": {
        "expectUserResponse": continuous,
        "richResponse": {
          "items": [{
            "simpleResponse": {
              "ssml": `<speak>${speech}</speak>`,
              "displayText": txt
            }
          }]
        }
      }
    }
  };;


  // Contexts
  for (const x in req.queryResult.parameters) {
    output = tools.respond.context({
      output,
      req,
      contextName: x,
      context: req.queryResult.parameters[x]
    });
  }
  // Slack
  output = tools.respond.slack.card({
    subject: data,
    req,
    output,
    txt
  });
  console.log(output.payload.slack);

  // Suggestions
  output = tools.respond.suggestions({
    suggestions: data.suggestions,
    output
  });

  if (data.card) {
    output.payload.google.richResponse.items.push(data.card);
  }

  return JSON.stringify(output);
};

exports = module.exports = respond;