'use strict';

const respondTools = {
  context: ({
    output,
    req,
    contextName = 'spell',
    context = ''
  }) => {
    // Things to remember for this session

    const contextFullName = `${req.session}/contexts/${contextName}`;

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

    data.parameters[contextName] = context;

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

const respond = ({
  data,
  req
}) => {
  let output = {
    "fulfillmentText": data.data,
    "fulfillmentMessages": [{
        "platform": "ACTIONS_ON_GOOGLE",
        "simpleResponses": {
          "simpleResponses": [{
            "textToSpeech": data.speech || data.data
          }]
        }
      },
      {
        "text": {
          "text": [
            data.data
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