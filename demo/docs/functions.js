'use strict';

/* globals window , document, fetch */
/* eslint-disable require-jsdoc */

const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;

let mute = false;


const speechBubble = (input, speaker) => {
  let bubble = document.createElement('div'),
    container = document.querySelector('.chat-container');
  bubble.innerHTML = input;
  bubble.classList = `speech-bubble ${speaker}-said`;
  container.prepend(bubble);
}

const say = input => {
  let synth = window.speechSynthesis,
    utterThis = new SpeechSynthesisUtterance(input);

  synth.speak(utterThis);
}

// const startListening = input => {
//   document.querySelector('body').className = document.querySelector('body').className + ' listening';
//   recognition.start();
//   recognition.onresult = function (event) {
//     userInputs(event.results[0][0].transcript);
//     stopListening();
//   };
// }

const stopListening = () => {
  recognition.stop();
  document.querySelector('body').className = document.querySelector('body').className.replace(/\slistening/gi, '');
}

const botToggleMute = () => {
  mute = !mute;
}

const buildCard = input => {
  let bubble = document.createElement('div'),
    container = document.querySelector('.chat-container');
  bubble.innerHTML = `<h2>${input.title}</h2><p>${input.subtitle}</p>`;
  bubble.classList = `card bot-said`;
  container.prepend(bubble);
}

const buildSuggestions = input => {
  let container = document.querySelector('.suggestions-container');
  input.forEach(x => {
    let chip = document.createElement('a');
    chip.setAttribute('onclick', `userInputs('${x.title}')`);
    chip.innerText = x.title;
    chip.classList = 'suggestion';
    container.append(chip);
  });
}

const fn = {
  getId: (length = 24) => {
    let output = '';
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    while (output.length < length) {
      output += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return output;
  }
};

const userInputs = input => {
  console.log('User asked: ', input);
  // clear suggestions
  document.querySelector('.suggestions-container').innerHTML = '';
  speechBubble(input, 'user');
  document.querySelector('.user-input').value = '';
  fetch(`https://api.dialogflow.com/v1/query?query=${input}&lang=en&v=20150910&sessionId=${fn.getId()}`, {
    method: 'GET',
    headers: {
      "Authorization": "Bearer 76a83b56dea94025ab23e4aac73c3e4f"
    }
  }).then(x => x.json()).
  then(data => {
    console.log(data);
    data.result.fulfillment.messages.forEach(x => {
      switch (x.type) {
        case 'simple_response':
          speechBubble(x.displayText, 'bot');
          if (!mute) {
            say(x.textToSpeech);
          }
          break;
        case 'suggestion_chips':
          buildSuggestions(x.suggestions);
          break;
        default:
          break;
      }
    });
    // if (data.fulfillmentMessages.length && data.fulfillmentMessages[0].card) {
    //   buildCard(data.fulfillmentMessages[0].card);
    // }
  });
}