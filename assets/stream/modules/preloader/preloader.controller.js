(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('preloaderController', preloaderController);

    preloaderController.$inject = ['intercomService', 'config', '$scope', '$timeout', '$rootScope'];

    function preloaderController(intercomService, config, $scope, $timeout, $rootScope) {
        $rootScope.statusPreloaders = false; // Начальное значение активности прелоадера
        $scope.config = config;

        activate();

        ////////////////

        function activate() {
            intercomService.on('hidePreloader', hidePreloader);
            intercomService.on('showPreloader', showPreloader);
        }

        function hidePreloader(){
            config.debug ? console.info('Preloader : hide ----------------------------------------------------------------------------------------------------------->> ALL REQUESTS COMPLETED. SITE READY') : null;
            $timeout(function(){
                $rootScope.statusPreloaders = false;
            });

        }

        function showPreloader(){
            $rootScope.statusPreloaders = true;
        }
    }
})();
