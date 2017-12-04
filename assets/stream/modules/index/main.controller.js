(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('indexController', indexController);

    indexController.$inject = ['$rootScope','$http','$location','authenticationService','$sce'];

    function indexController($rootScope,$http,$location,authenticationService,$sce) {
        var vm = this;
        vm.ourPartners = [
            {
                alt: 'QIWI',
                img: '/src/img/base/icons/qiwi.png',
                link: '//qiwi.ru'
            },
            {
                alt: 'Plarium',
                img: '/src/img/base/icons/plarium.png',
                link: '//plarium.com'
            },
            {
                alt: 'HyperX',
                img: '/src/img/base/icons/hyperx.png',
                link: '//hyperxgaming.com'
            },
            {
                alt: 'AOC',
                img: '/src/img/base/icons/aoc.png',
                link: '//aoc-europe.com'
            },
            {
                alt: 'Gamazavr',
                img: '/src/img/base/icons/gamazavr.png',
                link: '//gamazavr.ru'
            },
            {
                alt: 'Qcyber',
                img: '/src/img/base/icons/qcyber.png',
                link: '//q-cyber.com'
            }
        ];
        vm.indexBranding = false; //Наличие брендирования на главной странице
        vm.showCategory = '';
        vm.streamsLimit = 7;
        vm.showStreamNow = [];

        vm.joinRaffle = joinRaffle;
        vm.setCurrentCategory = setCurrentCategory;
        vm.streamsPlusFilter = streamsPlusFilter;
        vm.startRaffle = startRaffle;

        activate();

        ////////////////

        function activate() {
            getTopRafflesInfo();
            getAllGamesInfo();
            getStreamHosts();
        }

        /**
         * Получение данных о ТОП-4 розыгрышах
         */
        function getTopRafflesInfo() {
            $http.get('/api/home/raffles')
                .then(function(response){
                    vm.topRafflesInfo = response.data.data;
                })
        }

        function getStreamHosts() {
            $http.get('/api/home/hosts')
                .then(function(response){
                    if (response.data.data) {
                        vm.streamHostData = response.data.data;
                    } else {
                        vm.streamHostData = 'streampub';
                    }
                    vm.streamHostUrl = 'https://player.twitch.tv/?volume=0.5&channel=' + vm.streamHostData;
                    vm.streamHost = $sce.trustAsResourceUrl(vm.streamHostUrl);
                });

        }

        /**
         * Получение инфы о всех категориях играх
         */
        function getAllGamesInfo() {
            $http.get('/api/games')
                .then(function(response){
                    vm.allGames = response.data.data;
                })
                .then(getMiddleRafflesInfo)
        }

        /**
         * Переход в розыгрыш и встепление в него.
         * @param row
         */
        function joinRaffle(row){
            sessionStorage.setItem('autoJoin', true);
            $location.url(row.shortLink);
        }

        /**
         * Получение данных о ТОП-4 розыгрышах
         */
        function getMiddleRafflesInfo() {
            $http.get('/api/home/streamers')
                .then(function(response){
                    vm.middleStreamersInfo = response.data.data;
                })
                .then(function(){
                    vm.middleStreamersInfo.forEach(function(f){
                        if (vm.showCategory == '' || f.games.indexOf(vm.showCategory) != -1) {
                            vm.showStreamNow.push(f);
                        }
                    });
                })
        }

        /**
         * Поиск и определение текущей категории в играх
         * @param link - ID категории
         */
        function setCurrentCategory(link) {
            vm.showCategory = link;
            vm.showStreamNow = [];
            vm.middleStreamersInfo.forEach(function(f){
                if (vm.showCategory == '' || f.games.indexOf(vm.showCategory) != -1) {
                    vm.showStreamNow.push(f);
                }
            });
        }

        /**
         * Отображение дополнительной кнопки "Загрузить еще"
         * @returns {boolean} - true, если необходимо отображать кнопку
         */
        function streamsPlusFilter() {
            if (vm.showStreamNow.length > vm.streamsLimit) {
                return true;
            }
        }

        /**
         * Создание розыгрыша
         */
        function startRaffle(){
            if ($rootScope.user) {
                $location.url('/wizard');
            } else {
                authenticationService.externalLogin('twitch','/wizard');
            }
        }
    }
})();