(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminTrackingStreamersList', adminTrackingStreamersList);

    adminTrackingStreamersList.$inject = ['$http','Notification'];

    function adminTrackingStreamersList($http,Notification) {
        var vm = this;
        vm.sortByCategory = {};
        vm.sortReverse = false; // Направление сортировки
        vm.orderData = 'name';
        vm.searchUser   = '';     // значение поиска по умолчанию
        vm.currentPage = 1;
        vm.count =0;
        vm.itemsPerPage = 100; // Запрос в базу за всеми пользователями

        vm.getStreamersList = getStreamersList;

        vm.saveTracked = saveTracked;

        activate();

        function activate() {
            getStreamersList();
        }

        /**
         * Получение списка стримеров с бэка
         */
        function getStreamersList(){
            var page = vm.currentPage - 1 || 0;
            var search = vm.searchUser || '';
            $http.get('/api/adm/streamer/track/list?page='+page+'&perPage='+vm.itemsPerPage+'&searchString='+search)
                .then(function(response){
                    vm.streamers = response.data.data.userInfos;
                    vm.count = response.data.data.count;
                });
        }


        function saveTracked(row){
            var data = {tracked: row.tracked};
            var postUrl = '/api/adm/streamer/track/' + row.id + '/update';
            $http.post(postUrl, data)
                .catch(function(){
                    console.error('adminStreamerList-saveTracked');
                }).then(function(){
                Notification.success('Установленно слежение!');
            })
        }

    }})();
