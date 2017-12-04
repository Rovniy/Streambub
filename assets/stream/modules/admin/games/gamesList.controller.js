(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminGamesAdd', adminGamesAdd);

    adminGamesAdd.$inject = ['$http'];

    function adminGamesAdd($http) {
        var vm = this;
        vm.add = {};

        vm.addGame = addGame;
        vm.saveChangeGame = saveChangeGame;

        activate();

        function activate() {
            getGames();
        }

        function getGames() {
            $http.get('/api/games')
                .then(function(response){
                    vm.gamesList = response.data.data;
                })
        }

        function addGame() {
            var data = {
                name: vm.add.name,
                link: vm.add.link,
                available: vm.add.available
            };
            $http.post('/api/adm/game/add',data)
                .then(function(){
                    vm.add = {};
                    getGames();
                })
        }

        function saveChangeGame(row) {
            var data = {
                    name: row.name,
                    link: row.link,
                    available: row.available
                },
                postUrl = '/api/adm/game/update/' + row.id;
            $http.post(postUrl, data)
                .then(function(){
                    row.success = true;
                })
        }

    }})();
