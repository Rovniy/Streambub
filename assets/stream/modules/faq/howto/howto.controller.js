(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('faqHowToController', faqHowToController);

    faqHowToController.$inject = ['$rootScope','$http'];

    function faqHowToController($rootScope,$http) {
        var vm = this;

        vm.countStep = countStep;

        activate();

        ////////////////

        function activate() {
            /**
             * Слежение за профилем пользователя
             */
            $rootScope.$watch('user',function(){
                if ($rootScope.user) {
                    vm.userInfo = window.location.host; // Получение личной ссылки
                    checkGiveAway();
                }
            })
        }

        /**
         * Получение данных о розыгрыше, по которому висит оверлей
         */
        function checkGiveAway() {
                var url = '/api/raffle/' + $rootScope.user.userData.name;
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

