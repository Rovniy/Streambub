(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['authenticationService', 'userService', 'config', 'modalService','localizationService'];

    function HeaderController(authenticationService, userService, config, modalService,localizationService) {
        var vm = this;
        vm.mainURL = config.mainUrl;
        vm.hideButton = true;
        vm.showInput = false;
        vm.loginError = false;
        vm.auth = undefined;
        vm.regError = false;
        vm.login = login;
        vm.registration = registration;
        vm.logout = logout;
        vm.externalLogin = externalLogin;
        vm.userOnline = userOnline;
        vm.openLoginModal = openLoginModal;
        vm.openRegModal = openRegModal;

        activate();

        ////////////////

        function activate() {

        }

        //Login на сайт
        function login(email, password) {
            authenticationService.login(email, password)
                .catch(function(response){
                    if (response.data.error.type == 'UserNotFoundException') {
                        vm.loginError = 'Такой пользователь не найден, или введен неверный пароль =(';
                        vm.loginPass = '';
                    }
                })
        }

        //Login на сайт
        function externalLogin(resourse) {
            vm.hideButton = false;
            authenticationService.externalLogin(resourse, window.location.pathname);
        }

        // Регистрация на сайте
        function registration(regEmail) {
            authenticationService.registration(regEmail)
                .catch(function(response){
                    if (response.data.error.type == 'UserExistException') {
                        vm.regError = 'Имя пользователя уже занято =(';
                    } else if (response.data.error.type == 'UserUnverifiedException') {
                        vm.regError = 'Эта почта уже используется. Ее необходимо подтвердить!';
                    } else if (response.data.error.type == 'EmailAlreadyInUseException') {
                        vm.regError = 'Эта почта уже используется =(';
                    }
                })
        }

        //Logout с сайта
        function logout() {
            authenticationService.logout();
        }

        /**
         * Проверка статуса пользователя
         * Вернет объект или false
         */
        function userOnline() {
            return userService.getUserProfile();
        }

        function openLoginModal() {
            modalService.openModal('popupLogin', '', 'md', 'popuplogin');
        }

        function openRegModal() {
            modalService.openModal('popupRegistration', '', 'md', 'popupregistration');
        }

    }
})();

