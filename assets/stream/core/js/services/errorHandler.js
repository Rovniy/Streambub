(function () {
    'use strict';

    angular
        .module('streampub')
        .service('errorHandler', errorHandler);

    errorHandler.$inject = ['modalService', 'intercomService', '$location' ];

    function errorHandler(modalService, intercomService, $location ) {
        var vm = this;

        intercomService.on('errorHandler.login.error', checkErrorType);

        activate();

        function activate() {

        }

        // Получение GET-параметров и выполнение соответствующих действий
        function checkErrorType() {
            vm.getUrlData = $location.search();
            // Email уже используется на другом аккаунте
            if (vm.getUrlData.error == 'EmailAlreadyInUseException') {
                modalService.openModal('twitchEmailAlreadyInUseException', vm.getUrlData, 'md', 'twitcherrors');
            }
            // Пользователь не подтвердил почту на twitch
            else if (vm.getUrlData.error == 'UserUnverifiedException') {
                modalService.openModal('twitchUserUnverifiedException', vm.getUrlData, 'md', 'twitcherrors');
            }
            // Такой пользователь уже есть на платформе
            else if (vm.getUrlData.error == 'AuthAlreadyInUseException') {
                modalService.openModal('twitchEmailAlreadyInUseException', vm.getUrlData, 'md', 'twitcherrors');
            }
            // Пользователь не подтвердил почту на twitch
            else if (vm.getUrlData.error == 'AuthUnverifiedException') {
                modalService.openModal('twitchUserUnverifiedException', vm.getUrlData, 'md', 'twitcherrors');
            }
            // Пользователь не подтвердил почту на twitch
            else if (vm.getUrlData.error == 'MultiAccountBlockException') {
                modalService.openModal('MultiAccountBlockException', vm.getUrlData, 'md', 'twitcherrors');
            }
            //$location.search('');
        }

    }
})();