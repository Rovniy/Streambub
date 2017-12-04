(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminStreamersCreatorsList', adminStreamersCreatorsList);

    adminStreamersCreatorsList.$inject = ['$http','$scope','$rootScope', 'preloader'];

    function adminStreamersCreatorsList($http, $scope,$rootScope,preloader) {
        var vm = this;
        vm.streamersGames = [];

        vm.saveCreator = saveCreator;
        vm.addGameToCreator = addGameToCreator;
        vm.saveAll = saveAll;

        activate();

        function activate() {
            getStreamersList();
            getGames();
        }

        function getStreamersList(key){
            $http.get('/api/adm/creators?page=0&perPage=1000&searchString')
                .then(function(response){
                    vm.creators = response.data.data;
                })
        }

        function getGames() {
            $http.get('/api/games')
                .then(function(response){
                    vm.gamesList = response.data.data;
                })
        }

        function saveAll() {
            var key = 0;
            vm.creators.forEach(function(f){
                if (f.danger) {
                    saveCreator(f, key);
                }
                key++;
            })
        }

        function saveCreator(row ,key) {
            vm.disableBtn = true;
            var postUrl = 'api/adm/creator/update/' + row.id;
            var games = [];
            vm.creators[key].streamerGames.forEach(function(f){
                var obj = {
                    game: f.game.id
                };
                games.push(obj);
            });
            var postdata = {
                name: vm.creators[key].name,
                communication: vm.creators[key].comunnication,
                mainPlatform: vm.creators[key].mainPlatform,
                interactive: vm.creators[key].interactive,
                skill: vm.creators[key].skill,
                charisma: vm.creators[key].charisma,
                streamerGames: games
            };
            $http.post(postUrl, postdata)
                .then(function(){
                    vm.disableBtn = false;
                    row.success = true;
                })
        }

        function addGameToCreator(row,key) {
            var data = JSON.parse(row.addGame[0]),
                toPush = {
                    game: {
                        id: data.id,
                        name: data.name,
                        link: data.link,
                        available: data.available
                    }
                };
            row.danger = true;
            row.success = false;
            vm.creators[key].streamerGames.push(toPush);
            console.log('vm.creators[key]', vm.creators[key], key);
        }

        
    }})();
