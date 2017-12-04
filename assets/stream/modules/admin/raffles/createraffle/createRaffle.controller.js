(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminRafflesCreateRaffle', adminRafflesCreateRaffle);

    adminRafflesCreateRaffle.$inject = ['userService','$location', 'preloader','$http'];

    function adminRafflesCreateRaffle(userService,$location, preloader,$http) {
        var vm = this;
        vm.tasks = [];
        vm.address = window.location.host;

        vm.saveNewRaffle = saveNewRaffle;
        vm.addToActionsList = addToActionsList;
        vm.deleteFromTargetList = deleteFromTargetList;

        activate();

        function activate() {
            getGiftsList();
            getUsersList();
        }

        function getGiftsList() {
            $http.get('/api/adm/gift/list?page=0&perPage=10000')
                .then(function(response){
                    vm.giftList = response.data.data;
                })
        }

        function getUsersList(){
            $http.get('/api/adm/streamers?page=0&perPage=10000&searchString')
                .then(function(response){
                    vm.streamersList = response.data.data.userInfos;

                })
        }

        // Удаление элемента из списка тасков
        function deleteFromTargetList(key) {
            vm.tasks.splice(key,1);
        }

        // добавление в список тасков для кампании
        function addToActionsList(type) {
            var sampleObj = {};
            if (type == 'CPA') {
                sampleObj = {
                    name: null,
                    luck: null,
                    id: null,
                    params: {
                        url: vm.url
                    },
                    taskType: type,
                    owner: null
                };
                vm.tasks.push(sampleObj);
            } else {
                sampleObj = {
                    name: null,
                    luck: null,
                    id: null,
                    taskType: type
                };
                vm.tasks.push(sampleObj);
            }
        }

        function saveNewRaffle() {
            var data = {
                "giftId": vm.gift,
                "user": vm.owner,
                "tasks": vm.tasks,
                "count": vm.count
            };
            $http.post('/api/adm/raffle',data)
                .then(function(response){
                    vm.response = response.data;
                })
                .catch(function(response){
                    vm.error = response.data;
                })
        }


    }})();
