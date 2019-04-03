global.isDev = process.env.NODE_ENV === 'dev';
global.randomPhrasing = true;
global.implicitConfirmation = true;

const options = {
    contextsClear: {
        "spell": [
            "weapon"
        ],
        "weapon": [
            "spell"
        ]
    },
    continuousConversation: [
        "spell_get_init",
        "base_input_welcome"
    ]
};

exports = module.exports = options;