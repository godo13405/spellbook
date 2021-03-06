'use strict';

const tools = require('./tools/_tools.js');

// eslint-disable-next-line max-lines-per-function
const respond = {
  default: ({
    data,
    req,
    continuous = true
  }) => {
    let txt = "";
    if (data) {
      txt = tools.text.strip(data.data || data.speech || txt);
    }

    let output = {
      "fulfillmentText": txt,
      "fulfillmentMessages": [{
        "text": {
          "text": [
            txt
          ]
        }
      }]
    };

    // Contexts
    if (req.queryResult) {
      output = tools.respond.context({
        output,
        req,
        context: req.queryResult.parameters
      });
    }

    // Slack
    output = tools.respond.slack.card({
      subject: data,
      req,
      output,
      txt
    });
    return output;
  },
  google: ({
    data,
    req,
    continuous = true
  }) => {
    let txt = "",
      speech = txt;
    if (data) {
      txt = tools.text.strip(data.data || data.speech || txt);
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
    };

    // Contexts
    if (req.queryResult) {
      output = tools.respond.context({
        output,
        req
      });
    }

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