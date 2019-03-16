'use strict';

const http = require("https"),
    options = {
        "method": "POST",
        "hostname": "dialogflow.googleapis.com",
        "path": `/v2beta1/projects/spellbook-7ccae/agent/sessions/*:detectIntent?alt=json`,
        "headers": {
            "Authorization": `Bearer ${process.env.TOKEN}`,
            "auth": ")6@9npt?Fwgp={V",
            "Accept": "application/json",
            "Content-Type": "application/json",
            "cache-control": "no-cache"
        },
        "body": {
            "queryInput": {
                "text": {
                    "languageCode": "en",
                    "text": "what is fireball"
                }
            }
        }
    };

let req = http.request(options, res => {
    let chunks = [];

    res.on("data", chunk => {
        chunks.push(chunk);
    });

    res.on("end", () => {
        let body = Buffer.concat(chunks);
        console.log(body.toString());
    });
});

req.write(JSON.stringify({
    queryInput: {
        text: {
            languageCode: 'en',
            text: 'what is fireball'
        }
    }
}));
req.end();