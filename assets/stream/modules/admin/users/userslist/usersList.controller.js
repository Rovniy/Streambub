(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminUsersList', adminUsersList);

    adminUsersList.$inject = ['$http','Notification'];

    function adminUsersList($http,Notification) {
        var vm = this;
        vm.orderData     = 'user.name'; // значение сортировки по умолчанию
        vm.sortReverse = false; // Направление сортировки
        vm.searchUser   = '';     // значение поиска по умолчанию
        vm.itemsPerPage = 100; // Запрос в базу за всеми пользователями
        vm.count =0;
        vm.paginationLength = 5000000;
        vm.currentPage = 1;
        vm.users = [];


        vm.getPageData = getPageData;

        activate();

        function activate() {
            return getPageData();
        }

        function getPageData(){
            var page = vm.currentPage - 1 || 0;
            var search = vm.searchUser || '';

            $http
                .get('/api/adm/users?page='+page+'&perPage='+vm.itemsPerPage+'&searchString='+search)
                .then(function (response) {
                    vm.users = response.data.data.userInfos;
                    vm.count = response.data.data.count;
                    vm.paginationLength = vm.count/vm.itemsPerPage+1;
                });
        }

        /**
         * Получение списка стримеров с бэка
         */
        function getStreamersList(){
            $http.get('/api/adm/streamers?page=0&perPage=1000&searchString')
                .then(function(response){
                    vm.streamers = response.data.data.userInfos;
                });
        }





    }})();
