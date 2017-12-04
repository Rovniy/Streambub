(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminAdsCompanyList', adminAdsCompanyList);

    adminAdsCompanyList.$inject = ['userService','$location', 'preloader','$http'];

    function adminAdsCompanyList(userService,$location, preloader,$http) {
        var vm = this;

        vm.sortByCategory = {};
        vm.sortReverce = false; // Направление сортировки
        vm.orderData = 'key';

        activate();

        function activate() {
            checkAdminRules();
            getAdsList();
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

        function getAdsList(){
            $http.get('/api/adm/campaign/list')
                .then(function(response){
                    vm.adsList = response.data.data;
                })
        }

    }})();
