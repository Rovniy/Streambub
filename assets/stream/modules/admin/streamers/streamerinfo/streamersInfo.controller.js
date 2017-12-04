(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminStreamersStreamerInfo', adminStreamersStreamerInfo);

    adminStreamersStreamerInfo.$inject = ['userService','$location', 'preloader'];

    function adminStreamersStreamerInfo(userService,$location, preloader) {
        var vm = this;

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
