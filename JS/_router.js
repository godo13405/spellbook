'use strict';

const respond = require('./_respond.js');

const router = {
    ready: req => {
        let output = 'Sorry, something went wrong';
        const intent = {
                raw: req.queryResult.action,
                action: req.queryResult.action.split('.')[0],
                entity: req.queryResult.action.split('.')[1],
                function: req.queryResult.action.split('.')[2]
            },
            params = req.queryResult.parameters,
            fn = require(`./_${intent.entity}.js`);

        output = fn[intent.function]({
            intent,
            params
        });
        
        if (global.verbose) console.log('\x1b[32m', output, '\x1b[0m');

        return respond(output);
    }
};

exports = module.exports = router;