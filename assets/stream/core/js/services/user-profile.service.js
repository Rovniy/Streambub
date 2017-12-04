(function () {
    'use strict';

    angular
        .module('streampub')
        .service('userService', userService);

    userService.$inject = ['$http', '$q', 'preloader'];

    function userService($http, $q, preloader) {

        var userProfile = undefined; //хранение данных текущего пользователя
        var loaderPromise = null; //Статус загрузки данных пользователя

        this.loadUserProfile = loadUserProfile;
        this.getUserProfile = getUserProfile;
        this.resetUserProfile = resetUserProfile;
        this.isAdmin = isAdmin;


        ////////////////

        // Загрузка данных пользователя
        function loadUserProfile() {
            // предотвращение параллельных запросов
            if (!loaderPromise) {
                loaderPromise = $http
                    .get('/api/profile')
                    .then(loadUserProfileComplete)
                    .catch(loadUserProfileFailed);
            }

            return loaderPromise;
        }

        function loadUserProfileComplete(response) {
            userProfile = response.data.data;
            loaderPromise = $q.when(userProfile);
            return userProfile;
        }

        function loadUserProfileFailed(error) {
            loaderPromise = null;
            return $q.reject(error);
        }

        // Обновление профайла
        function resetUserProfile() {
            userProfile = undefined;
            loaderPromise = null;
        }

        function getUserProfile() {
            return userProfile;
        }

        function isAdmin() {
            return userProfile && userProfile.userData.role === "ADMIN";
        }

    }

})();