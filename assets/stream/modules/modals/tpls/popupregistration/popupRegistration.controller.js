(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('popupRegistrationController', popupRegistrationController);

    popupRegistrationController.$inject = ['authenticationService', '$rootScope'];

    function popupRegistrationController(authenticationService, $rootScope) {
        var vm = this;
        vm.step = 1;
        vm.regError = false;

        vm.registration = registration;
        vm.regWithExternal = regWithExternal;

        function registration(email) {
            authenticationService.registration(email)
                .then(function(){
                    $scope.$dismiss();
                    if ($rootScope.redirectUrl) {
                        sessionStorage.setItem('redirectUrl', $rootScope.redirectUrl);
                    }
                })
                .catch(function(response){
                    if (response.data.error.type == 'UserExistException') {
                        vm.regError = 'Имя пользователя уже занято';
                    } else if (response.data.error.type == 'UserUnverifiedException') {
                        vm.regError = 'Эта почта уже используется. Ее необходимо подтвердить';
                    } else if (response.data.error.type == 'EmailAlreadyInUseException') {
                        vm.regError = 'Эта почта уже используется';
                    } else if (response.data.error.type == 'MultiAccBlockException') {
                        vm.regError = 'Регистрация нескольких аккаунтов с одного устройства запрещена.';
                    }
                })
        }

        function regWithExternal(resourse) {
            authenticationService.externalLogin(resourse, window.location.pathname);
        }
    }
})();