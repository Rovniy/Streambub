(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('footerController', footerController);

    footerController.$inject = ['config','localizationService'];

    function footerController(config,localizationService) {
        var vm = this;
        vm.version = config.version;
        vm.copy = config.copy;
        vm.vk = config.social.vkUrl;
        vm.fb = config.social.fbUrl;

        vm.setLanguage = setLanguage;
        vm.getCurrentLanguage = getCurrentLanguage;

        activate();

        ////////////////

        function activate() {

        }


        function setLanguage(lang){
            localizationService.setLanguage(lang);
        }


        function getCurrentLanguage(){
            return localizationService.getLanguage();
        }
    }
})();

