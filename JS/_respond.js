'use strict';

const tools = require('./tools/_tools.js');

// eslint-disable-next-line max-lines-per-function
const respond = {
  bridge: ({
    data
  }) => {
    return data;
  },
  default: ({
    data,
    req,
    continuous = false
  }) => {
    let txt = "",
      speech = txt;
    // console.log('data:', data);
    // console.log('req:', Object.keys(req));
    if (data) {
      txt = tools.text.stripSsml(data.data || data.speech || txt);
      speech = tools.fn.sound(data.speech || data.data, data.audio || speech);
    }

    let output = {
      "fulfillmentText": txt,
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
                "textToSpeech": speech || txt,
                "ssml": `<speak>${speech}</speak>`,
                "displayText": txt
              }
            }]
          }
        }
      }
    }

    console.log('output: ', output);
    // Contexts
    if (req.queryResult) {
      for (const x in req.queryResult.parameters) {
        output = tools.respond.context({
          output,
          req,
          contextName: x,
          context: req.queryResult.parameters[x]
        });
      }
    }

    // Slack
    output = tools.respond.slack.card({
      subject: data,
      req,
      output,
      txt
    });

    // Suggestions
    output = tools.respond.suggestions({
      suggestions: data.suggestions,
      output
    });
    if (data.card) {
      output.payload.google.richResponse.items.push(data.card);
    }
    return output;
  },
  alexa: ({
    data,
    continuous = false,
    output = {
      "version": "1.0",
      "response": {
        "outputSpeech": {
          "type": "SSML",
          "text": tools.fn.sound(data.speech || data.data, data.audio),
          "playBehavior": "REPLACE_ENQUEUED"
        },
        "shouldEndSession": !continuous
      }
    }
  }) => {
    return output;
  }
};

exports = module.exports = respond;