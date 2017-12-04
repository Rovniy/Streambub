(function () {
    'use strict';

    angular
        .module('streampub')
        .service('authenticationService', authenticationService);

    authenticationService.$inject = ['$http', 'preloader', 'intercomService', 'userService', '$window'];

    function authenticationService($http, preloader, intercomService, userService, $window) {
        this.login = login;
        this.logout = logout;
        this.externalLogin = externalLogin;
        this.registration = registration;
        this.restorePswrd = restorePswrd;

        ////////////////

        // Авториязация по логину / паролю
        function login(email, password) {
            preloader.act('authenticationService-login');
            var data =  {
                email: email,
                password: password
            };
            return $http
                .post('/api/login', data)
                .then(function () {
                    intercomService.emit('authentication.login');
                })
                .finally(function(response){
                    preloader.dis('authenticationService-login',response);
                });
        }

        // Авторизация через внешние ресурсы
        function externalLogin(provider, goto) {
            preloader.act('authenticationService-externalLogin');
            var getUrl;
            // console.log('goto:' + goto);
            if (goto) {
                getUrl = '/api/authenticate/' + provider + '?back_uri=' + goto;
            } else {
                getUrl = '/api/authenticate/' + provider + '?back_uri=/';
            }
            $http.get(getUrl)
                .then(function (response) {
                    location.href = response.data.data.redirect_url;
                    preloader.dis('authenticationService-externalLogin');
                })
                .finally(function(){
                    preloader.dis('authenticationService-externalLogin');
                });
        }

        // Регистрация пользователя
        function registration(email, action) {
            preloader.act('authenticationService-registration');
            var data = {
                email: email,
                password: 'passwordpassword'
            };

            if (action && action == 'autoLogin') {
                //TODO............................
            } else {
                return $http.post('/api/signup', data)
                    .then(function(){
                        $window.location.reload();
                    })
                    .finally(function(){
                        preloader.dis('authenticationService-registration');
                    })
            }
        }

        // Выход из аккаунта
        function logout() {
            preloader.act('authenticationService-logout');
            $http.get('/api/logout')
                .then(function () {
                    userService.resetUserProfile();
                    window.location.href = '/';
                    preloader.dis('authenticationService-logout');
                })
                .finally(function(){
                    preloader.dis('authenticationService-logout');
                });
        }

        // Восстановление пароля на почту
        function restorePswrd(email) {
            var data = {
              email: email
            };
            return $http.post('/api/accounts/password/reset', data)
        }
    }

})();

