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
  }
};

const respond = ({
  data,
  req
}) => {
  let output = {
    "fulfillmentText": data
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

  return JSON.stringify(output);
};

exports = module.exports = respond;