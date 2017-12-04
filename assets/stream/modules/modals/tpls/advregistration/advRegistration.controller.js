(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('advRegistration', advRegistration);

    advRegistration.$inject = ['$http','userService','$rootScope'];

    function advRegistration($http,userService,$rootScope) {
        var vm = this;

        vm.register = register;

        function register(email) {
            var data = {
                email: email,
                password: 'passwordpassword'
            };
            $http.post('/api/signup', data)
                .then(function(response){
                    vm.thatsok = true;
                    checkMyProfile();
                })
        }

        function checkMyProfile() {
            return userService
                .loadUserProfile()
                .then(function () {
                    $rootScope.user = userService.getUserProfile();
                    $rootScope.user.accounts = {};
                    console.log('Userprofile: данные пользователя получены', $rootScope.user);
                })
                .then(function(){
                    $rootScope.user.userData.providers.forEach(function(f){
                        if (f == 'password') $rootScope.user.accounts.password = true;
                    })
                })
        }

    }

})();