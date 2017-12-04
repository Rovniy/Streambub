(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('popupLoginController', popupLoginController);

    popupLoginController.$inject = ['authenticationService', 'modalService', '$rootScope','preloader','$scope'];

    function popupLoginController(authenticationService, modalService, $rootScope,preloader,$scope) {
        var vm = this;
        vm.loginError = false;
        vm.login = login;
        vm.restorePassword = restorePassword;
        vm.registerWindowOpen = registerWindowOpen;
        vm.enterWithTwitch = enterWithTwitch;



        function login(email, pass) {
            authenticationService.login(email, pass)
                .then(function(){
                    $scope.$dismiss();
                    if ($rootScope.redirectUrl) {
                        sessionStorage.setItem('redirectUrl', $rootScope.redirectUrl);
                    }
                })
                .catch(function(response){
                    if (response.data.error.type == 'UserNotFoundException') {
                        vm.loginError = 'Такой пользователь не найден, или введен неверный пароль.';
                        vm.password = '';
                    }
                })
        }

        function restorePassword(login) {
            modalService.openModal('popupRestore', login, 'md', 'popuprestore');
        }

        function registerWindowOpen() {
            modalService.openModal('popupRegistration', '', 'md', 'popupregistration')
        }

        function enterWithTwitch(resourse) {
            authenticationService.externalLogin(resourse,window.location.pathname);
        }
    }

})();