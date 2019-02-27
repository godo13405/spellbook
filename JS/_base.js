'use strict';

const tools = require('./_tools.js');

const base = {
    input: {
        welcome: ({
            intent
        }) => {
            let output = {
                data: tools.phrase({
                    phrase: intent.raw,
                }),
                "suggestions": [
                    `What is ${tools.randSpell()}`,
                    `How long to cast ${tools.randSpell()}`
                ]
            };
            return output;
        },
        fallback: () => {
            let output = {
                data: [
                    'I didn\'t get that. Can you say it again?',
                    'I missed what you said.What was that ?',
                    'Sorry, could you say that again ?',
                    'Sorry, can you say that again ?',
                    'Can you say that again ?',
                    'Sorry, I didn\'t get that. Can you rephrase?',
                    'Sorry, what was that ?',
                    'One more time ?',
                    'What was that ?',
                    'Say that one more time ?',
                    'I didn\'t get that. Can you repeat?',
                    'I missed that, say that again ?'
                ]
            };
            output.data = output.data[Math.floor(Math.random() * output.data.length)];
            return output;
        }
    }
};

exports = module.exports = base;