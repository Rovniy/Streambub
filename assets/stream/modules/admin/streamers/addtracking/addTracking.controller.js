(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminAddTracking', adminAddTracking);

    adminAddTracking.$inject = ['preloader','userService','$location','$http'];

    function adminAddTracking(preloader,userService,$location,$http) {
        var vm = this;
        vm.name = '';


        vm.createTracking = createTracking;

        activate();

        function activate() {
            checkAdminRules();
            getStreamers();
        }


        // Получение списка стримеров
        function getStreamers() {
            $http.get('/api/adm/streamers?page=0&perPage=1&searchString')
                .then(function(response){
                    var getUrl = '/api/adm/streamers?page=0&perPage='+ response.data.data.count +'&searchString';
                    $http.get(getUrl)
                        .then(function(response){
                            vm.usersList = response.data.data.userInfos;
                        })
                })
        }
        // Проверка юзера на админа
        function checkAdminRules() {
            preloader.act('adminStreamersStreamersList');
            if (!userService.isAdmin()) {
                preloader.dis('adminStreamersStreamersList');
                $location.url('/');
            } else {
                preloader.dis('adminStreamersStreamersList');
            }
        }


        function createTracking() {
            vm.error = undefined;
            var data = {
                name: vm.name,
                tracked: vm.tracked
            };
            $http.post('/api/adm/streamer/track/create', data)
                .then(function(){
                    vm.success = 'OK';
                })
                .catch(function(response){
                    vm.error = response.data;
                });
        }


    }})();
