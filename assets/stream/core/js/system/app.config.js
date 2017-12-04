(function () {
    'use strict';

    angular
        .module('streampub', [
            'ngAnimate',
            'ngRoute',
            'ngSanitize',
            'ngCookies',
            'ui.bootstrap',
            'ui-notification',
            'environment',
            'pascalprecht.translate',
            'angularFileUpload',
            'wysiwyg.module',
            'rzModule',
            'mgcrea.jquery',
            'mgcrea.bootstrap.affix',
            'angular-click-outside',
            'ngImgCrop'
/*            'infinite-scroll'*/
        ])
        .constant('config', {
            version: '1.2.9', //Текущая версия сайта
            template: 'stream', //Шаблон сайта
            theme: 'default', //Тема сайта
            mainUrl: window.location.protocol+ '//' + window.location.host,
            copy: 'StreamPub Ltd. &copy ',
            social: {
                vkUrl: 'http://vk.com/streampubnet', //Ссылка на страницу вконтакте
                fbUrl: 'https://www.facebook.com/streampub' //Ссылка на страницу вконтакте
            },
            debug: window.location.host == 'stream.local:9360' || window.location.host == 'onlinekiller.ru' ? true : false,
            preloaderType: 3, // 1 - Круговой прелоадер, 2 - Маятниковый прелоадер, 3 - пульсирующий логотип StreamPub
            dollar: 62.5 //стоимость доллара в рублях
        })
        .config(config);

    config.$inject = ['$locationProvider', '$translateProvider', '$httpProvider', 'NotificationProvider'];

    function config ($locationProvider, $translateProvider, $httpProvider, NotificationProvider) {

        $translateProvider
            .useStaticFilesLoader({
                prefix: '/src/localization/locale-',
                suffix: '.json?' + Date.now()
            })
            .useSanitizeValueStrategy('sanitizeParameters')
            .registerAvailableLanguageKeys(['ru', 'en'], {
                'ru*': 'ru',
                'en*': 'en',
                '*': 'en' // must be last!
            })
            .fallbackLanguage('en')
            .determinePreferredLanguage()
            .useLocalStorage()
            .useMissingTranslationHandlerLog();

        $locationProvider.html5Mode(true);


        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'bottom'
        });

    }

})();