(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('firstsessionModalController', firstsessionModalController);

    firstsessionModalController.$inject = ['$http','$rootScope','$scope'];

    function firstsessionModalController($http,$rootScope,$scope) {
        var vm = this;
        vm.section = 1;
        vm.checkboxHide = false;
        vm.countStep = countStep;
        vm.postAndGoToRaffle = postAndGoToRaffle;

        activate();
        
        function activate(){

            /**
             * Отслеживание активации checkbox для скрытия модального окна с подсказками
             */
            $scope.$watch('vm.checkboxHide',function(){
                if (vm.checkboxHide) {
                    console.log('поставил');
                    localStorage.setItem('hideRaffleModal', true);
                }
            });

            /**
             * Отслеживание подгрузки данных по пользователю
             */
            $rootScope.$watch('user',function(){
                if ($rootScope.user) {
                    vm.userInfo = window.location.host + '/' + $rootScope.user.userData.name; // Получение личной ссылки
                    vm.userURL = 'https://' + window.location.host + '/widget/obsoverlay/' + $rootScope.user.userData.name; // Получение личной ссылки
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

        /**
         * Отправка лога о действиях пользователя на странице
         */
        function postAndGoToRaffle() {
            var data = {
                iKnowFrom: vm.iKnowFrom || 'не заполнил',
                vkLink: vm.vkLink || 'не заполнил',
                youtubeLink: vm.youtubeLink || 'не заполнил'
            };
            var postUrl = '/api/log/modalRaffle';
            $http.post(postUrl, data)
        }

    }

})();