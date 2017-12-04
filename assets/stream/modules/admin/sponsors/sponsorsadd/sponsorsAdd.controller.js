(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminSponsorsAdd', adminSponsorsAdd);

    adminSponsorsAdd.$inject = ['userService','$location', 'preloader'];

    function adminSponsorsAdd(userService,$location, preloader) {
        var vm = this;

        vm.sortByCategory = {};
        vm.sortReverce = false; // Направление сортировки
        vm.orderData = 'key';

        activate();

        function activate() {
            checkAdminRules();
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

    }})();
