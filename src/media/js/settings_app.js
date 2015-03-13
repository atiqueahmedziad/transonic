define('settings_app',
    ['core/settings', 'settings_local'],
    function(settings, localSettings) {

    settings._extend({
        app_name: 'transonic',
        init_module: 'main',
        default_locale: 'en-US',
        api_url: 'http://' + window.location.hostname,  // No trailing slash, please.

        storage_version: '0',

        param_whitelist: ['q', 'sort'],
        api_param_blacklist: null,

        // Used for feed builder.
        model_prototypes: {
            'feed-app': 'slug',
            'feed-brand': 'slug',
            'feed-collection': 'slug',
            'feed-shelf': 'slug',
        },

        fragment_error_template: 'errors/fragment.html',
        pagination_error_template: 'errors/pagination.html',

        tracking_id: 'UA-36116321-6',

        title_suffix: 'Firefox Marketplace Curation Tools',

        languages: [
            'bn-BD', 'ca', 'cs', 'de', 'el', 'en-US', 'es', 'fr', 'hr', 'hu',
            'it', 'ja', 'mk', 'nl', 'pl', 'pt-BR', 'ro', 'ru', 'sr', 'sr-Latn',
            'sk', 'tr', 'zh-CN'
        ],

        carriers: [
            'america_movil',
            'china_unicom',
            'congstar',
            'deutsche_telekom',
            'etisalat',
            'grameenphone',
            'hutchinson_three_group',
            'kddi',
            'kt',
            'megafon',
            'mtn',
            'o2',
            'qtel',
            'singtel',
            'smart',
            'sprint',
            'telecom_italia_group',
            'telefonica',
            'telenor',
            'tmn',
            'vimpelcom'
        ],
    });

    settings._extend(localSettings);
});
