(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('streamerPromoController', streamerPromoController);

    streamerPromoController.$inject = ['$rootScope','$scope','$http','authenticationService','modalService','$routeParams','config'];

    function streamerPromoController($rootScope,$scope,$http,authenticationService,modalService,$routeParams, config) {
        var vm = this;
        vm.config = config;
        vm.urlData = $routeParams;
        $rootScope.landingPage = true;
        vm.currentSection = 1;
        vm.showNav = false;
        vm.firstGetWaiter = false;
        vm.myAvalailableGifts = [
            {
                img: 'https://streampub.net/img/gifts/84/deathadder.jpg',
                cat: 'Гаджеты'
            },
            {
                img: 'https://streampub.net/img/gifts/116/dishonored2.jpg',
                cat: 'Игры'
            },
            {
                img: 'https://streampub.net/img/gifts/125/MSIGT72S.jpg',
                cat: 'Техника'
            },
            {
                img: 'https://streampub.net/img/gifts/94/5000.jpg',
                cat: 'Геймерам'
            },
            {
                img: 'https://streampub.net/img/gifts/117/dxracer.jpg',
                cat: 'Другое'
            }
        ];

        vm.getMyBudget = getMyBudget;
        vm.goToGiveAwayPage = goToGiveAwayPage;
        vm.pageAnalitycs = pageAnalitycs;

        $scope.$watch('vm.currentSection',function(){
            console.log('vm.currentSection',vm.currentSection);
        });

        activate();

        ////////////////

        function activate() {
            // Отправка отчета о открытии страницы
            pageAnalitycs('streamer_open', {url: vm.urlData});
            console.log('$rootScope.landingPage', $rootScope.landingPage);
        }

        function getMyBudget(link){
            var platform, getUrl;
            if (link.indexOf('twitch') + 1) {
                platform = 'twitch';
            } else if (link.indexOf('youtube') + 1) {
                platform = 'youtube';
            } else {
                platform = 'twitch';
            }
            vm.myPlatform = platform;
            var substringArray = link.split("/");
            getUrl = '/api/budget/'+ platform + '/' + substringArray[substringArray.length-1];
            // Отправка отчета о вводимых никах
            pageAnalitycs('streamer_twitch', {username: substringArray[substringArray.length-1], url: vm.urlData});
            $http.get(getUrl)
                .then(function(response){
                    if (response.data.data) {
                        vm.myBudget = response.data.data;
                        vm.currentSection = 2;
                        vm.firstGetWaiter = false;
                        vm.myBudget.budget.perMounth = (vm.myBudget.budget.availableCash / 100 * 62.5 / 0.81).toFixed(0);
                        vm.myBudget.budget.perMoment = (vm.myBudget.budget.availableCash / 100 * 62.5).toFixed(0);
                        vm.myBudget.budget.all = ((vm.myBudget.budget.availableCash / 100 * vm.config.dollar * 4) + (vm.myBudget.budget.availableCash / 100 * vm.config.dollar / 0.81)).toFixed(0);
                    } else {
                        vm.firstGetWaiter = false;
                        modalService.openModal('default', {
                            text: 'Для того, чтобы ты смог создавать розыгрыши, у тебя должно быть минимум 500 подписчиков и 5000 просмотров канала на стриме. Развивай свой канал и приходи к нам снова! Мы дадим тебе множетсво интересных призов для розыгрышей!',
                            head: 'Ты еще слишком мал(('
                        }, 'md', 'default');
                    }
                })
                .catch(function(){
                    vm.firstGetWaiter = false;
                    modalService.openModal('default', {
                        text: 'Скорее всего ты ввел некорректную ссылку на свой стрим-канал, либо мы еще не работаем с этой стрим-платформой',
                        head: 'Ошибка!'
                    }, 'md', 'default');
                })
        }

        // Создание розыгрыша и переход на страницу розыгрыша
        function goToGiveAwayPage() {
            vm.pageAnalitycs('streamer_create_raffle', {url: vm.urlData, username: vm.myStreamLink});
            authenticationService.externalLogin(vm.myPlatform,'/'+vm.myStreamLink);
        }

        /**
         * Отправка лога о действиях пользователя на странице
         * @param event - событие для логирование. Свободный формат и значение
         * @param data - объект в формате JSON для отправки данных
         */
        function pageAnalitycs(event, data) {
            var postUrl = '/api/log/' + event;
            $http.post(postUrl, data)
        }



    }
})();