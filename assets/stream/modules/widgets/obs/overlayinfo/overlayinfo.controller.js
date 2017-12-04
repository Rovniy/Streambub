(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('overlayInfoController', overlayInfoController);

    overlayInfoController.$inject = ['$rootScope','$routeParams','$http','$scope'];

    function overlayInfoController($rootScope,$routeParams,$http,$scope) {
        var vm = this;
        vm.userInfo = window.location.host + '/' + $routeParams.userName; // Получение личной ссылки

        vm.countStep = countStep;

        activate();

        function activate() {
            $rootScope.widgetOpen = true;
            checkGiveAway();
        }

        /**
         * Получение данных о розыгрыше, по которому висит оверлей
         */
        function checkGiveAway() {
            var url = '/api/raffle/' + $routeParams.userName;
            $http.get(url)
                .then(function (response) {
                    vm.gaData = response.data.data;
                })
                .then(getUserCount)
        }

        /**
         * Автообновление количества участников в розыгрыше.
         * @config interval - частота запросов в секундах
         */
        function getUserCount() {
            var interval = 10;
            var getUrl = '/api/raffle/' + vm.gaData.id + '/member-count';
            setInterval(function(){
                $http.get(getUrl)
                    .then(function(response){
                        vm.gaData.stats.activeMembers = response.data.data;
                    })
            }, interval*1000);
        }

        /**
         * Подсчет кол-ва участников в процентах
         * @returns {number}
         */
        function countStep() {
            if (vm.gaData){
                return 100 / vm.gaData.stats.minMembers * vm.gaData.stats.activeMembers
            }

        }

    }
})();