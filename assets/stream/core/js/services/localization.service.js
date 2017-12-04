(function () {
    'use strict';

    angular
        .module('streampub')
        .service('localizationService', localizationService);

    localizationService.$inject = ['$translate', '$rootScope'];

    function localizationService($translate, $rootScope) {
        var currentLanguage;

        this.getLanguage = getLanguage;
        this.setLanguage = setLanguage;

        ////////////////

        /**
         * Получение текущего языка
         * @returns {string}
         */
        function getLanguage() {
            if (!currentLanguage) {
                currentLanguage = (
                    $translate.use() ||
                    $translate.storage().get($translate.storageKey()) ||
                    $translate.preferredLanguage()
                ).toUpperCase();
            }

            $rootScope.currentLang = currentLanguage;
            return currentLanguage;
        }

        function setLanguage(lang) {
            $translate.use(lang.toLowerCase());
            currentLanguage = lang;
            $rootScope.currentLang = currentLanguage;
        }
    }

})();

