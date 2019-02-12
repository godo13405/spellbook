'use strict';

const router = {
    ready: req => {
        const intent = {
            raw: req.queryResult.action,
            action: req.queryResult.action.split('.')[0],
            entity: req.queryResult.action.split('.')[1],
            function: req.queryResult.action.split('.')[2]
        },
            params = req.queryResult.parameters,
            fn = require(`./_${intent.entity}.js`);

        switch (intent.entity) {
            case 'spell':
                const data = require('../data/spell.json');
                break;
        }

        fn[intent.function](intent);

        return JSON.stringify(intent);
    }
};

exports = module.exports = router;