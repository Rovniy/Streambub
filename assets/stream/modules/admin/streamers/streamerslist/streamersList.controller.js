(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminStreamersStreamersList', adminStreamersStreamersList);

    adminStreamersStreamersList.$inject = ['$http','Notification'];

    function adminStreamersStreamersList($http,Notification) {
        var vm = this;
        vm.sortByCategory = {};
        vm.sortReverse = false; // Направление сортировки
        vm.orderData = 'user.name';
        vm.searchUser   = '';     // значение поиска по умолчанию
        vm.allViewers = {
            viewersPerDay: 0,
            viewersAtSameTime:0,
            streamsCount:0
        };
        vm.streamersNew = [];
        vm.currentPage = 1;
        vm.count =0;
        vm.itemsPerPage = 100; // Запрос в базу за всеми пользователями

        vm.saveValue = saveValue;
        vm.updateBudgetByAdmin = updateBudgetByAdmin;
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
            $http.get('/api/adm/streamers?page='+page+'&perPage='+vm.itemsPerPage+'&searchString='+search)
            // $http.get('/api/adm/streamers?page=0&perPage=1000&searchString')
                .then(function(response){
                    vm.streamers = response.data.data.userInfos;
                    vm.count = response.data.data.count;
                });
        }

        /**
         * Сохранение ограничений для стримера при событиии ng-blur.
         * @params obj row - весь объект стримера со всеми потрохами
         */
        function saveValue(row) {
            var postUrl = '/api/adm/' + row.user.id + '/restriction/' + row.user.restriction;
            $http.post(postUrl, {})
                .then(function(){
                    vm.streamers.forEach(function(f){
                        if (f.user.id == row.user.id) {
                            f.postSuccess = true;
                        }
                    })
                })
                .catch(function(){
                    console.error('adminStreamersStreamersList-saveValue');
                })
        }


        /**
         * Обновление бюджета
         */
        function updateBudgetByAdmin(row) {
            var postUrl = '/api/adm/user/' + row.user.id + '/budget/twitch';
            $http.post(postUrl, {})
                .then(getStreamersList)
                .then(function(){
                    Notification.success('Бюжет обновлен!');
                })

        }

        function saveTracked(row){
            var data = {tracked: row.user.tracked};
            var postUrl = '/api/adm/user/' + row.user.id + '/update';
            $http.post(postUrl, data)
                .catch(function(){
                    console.error('adminStreamerList-saveTracked');
                }).then(function(){
                Notification.success('Установленно слежение!');
            })
        }

    }})();
