(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminSponsorsList', adminSponsorsList);

    adminSponsorsList.$inject = ['userService','$location', 'preloader', '$http'];

    function adminSponsorsList(userService,$location, preloader, $http) {
        var vm = this;

        vm.sortByCategory = {};
        vm.sortReverce = false; // Направление сортировки
        vm.orderData = 'key';

        activate();

        function activate() {
            checkAdminRules();
            getSponsorsList();
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

        function getSponsorsList() {
            $http.get('/api/adm/sponsor/list?orderBy=name')
                .then(function(response){
                    vm.sponsorsList = response.data.data;
                })
        }

    }})();
