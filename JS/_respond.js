'use strict';


const respond = data => {
  let output = {
    "fulfillmentText": data
  };

  return JSON.stringify(output);
};

exports = module.exports = respond;