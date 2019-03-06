'use strict';

/* globals window , document, fetch, SpeechSynthesisUtterance */
/* eslint-disable require-jsdoc */

const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;

let mute = false;

const fn = {
  stopListening: () => {
    recognition.stop();
    document.querySelector('body').className = document.querySelector('body').className.replace(/\slistening/gi, '');
  },
  botToggleMute: () => {
    mute = !mute;
  },
  buildCard: input => {
    let bubble = document.createElement('div'),
      container = document.querySelector('.chat-container');
    bubble.innerHTML = `<h2>${input.title}</h2><p>${input.subtitle}</p>`;
    bubble.classList = `card bot-said`;
    container.prepend(bubble);
  },
  buildSuggestions: input => {
    let container = document.querySelector('.suggestions-container');
    input.forEach(x => {
      let chip = document.createElement('a');
      chip.setAttribute('onclick', `fn.userInputs('${x.title}')`);
      chip.innerText = x.title;
      chip.classList = 'suggestion';
      container.append(chip);
    });
  },
  speechBubble: (input, speaker) => {
    let bubble = document.createElement('div'),
      container = document.querySelector('.chat-container');
    bubble.innerHTML = input;
    bubble.classList = `speech-bubble ${speaker}-said`;
    container.prepend(bubble);
  },
  say: input => {
    let synth = window.speechSynthesis,
      utterThis = new SpeechSynthesisUtterance(input);

    synth.speak(utterThis);
  },
  getId: () => {
    return window.sessionId || fn.genId();
  },
  genId: (length = 24) => {
    let output = '';
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    while (output.length < length) {
      output += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return output;
  },
  startListening: input => {
    document.querySelector('body').className = `${document.querySelector('body').className} listening`;
    recognition.start();
    recognition.onresult = event => {
      fn.userInputs(event.results[0][0].transcript);
      fn.stopListening();
    };
  },
  userInputs: input => {
    // clear suggestions
    document.querySelector('.suggestions-container').innerHTML = '';

    fn.speechBubble(input, 'user');
    document.querySelector('.user-input').value = '';

    fn.api(input);
  },
  api: input => {
    fetch(`https://api.dialogflow.com/v1/query?query=${input}&lang=en&v=20150910&sessionId=${fn.getId()}`, {
      method: 'GET',
      headers: {
        "Authorization": "Bearer 0d4b7dfb0d104d94abb64ce45d2054f7"
      }
    }).then(x => x.json()).
    then(data => {
      window.sessionId = data.sessionId;
      data.result.fulfillment.messages.forEach(x => {
        switch (x.type) {
          case 'simple_response':
            fn.speechBubble(x.displayText, 'bot');
            if (!mute) {
              fn.say(x.textToSpeech);
            }
            break;
          case 'suggestion_chips':
            fn.buildSuggestions(x.suggestions);
            break;
          default:
            break;
        }
      });

      /*
       * if (data.fulfillmentMessages.length && data.fulfillmentMessages[0].card) {
       *   buildCard(data.fulfillmentMessages[0].card);
       * }
       */
    });
  }
};

window.fn = fn;