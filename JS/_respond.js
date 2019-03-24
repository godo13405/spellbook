'use strict';

const tools = require('./tools/_tools.js');

// eslint-disable-next-line max-lines-per-function
const respond = {
  default: ({
    data,
    req,
    continuous = true
  }) => {
    let txt = "",
      speech = txt;
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
    continuous = true,
    req,
    output = {
      "version": "1.0",
      "session": req.session,
      "response": {
        "outputSpeech": {
          "type": "PlainText",
          "text": tools.fn.sound(data.speech || data.data, data.audio)
        },
        "shouldEndSession": !continuous
      },
    }
  }) => {
    return output;
  }
};

exports = module.exports = respond;