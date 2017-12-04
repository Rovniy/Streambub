(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminRafflesRafflesList', adminRafflesRafflesList);

    adminRafflesRafflesList.$inject = ['$http','$location','userService', '$rootScope','Notification'];

    function adminRafflesRafflesList($http,$location,userService, $rootScope, Notification) {
        var vm = this;

        vm.sortByCategory = {};
        vm.sortReverce = false; // Направление сортировки
        vm.order = '-createTime';
        vm.orderData = 'active DESC,finished ASC,reject';
        vm.orderDirection = 'ASC';
        vm.active = true;
        vm.finished = false;
        vm.searchName = '';
        vm.rejected = false;


        vm.sortByCategory = sortByCategory;
        vm.cancelRaffleByAdmin = cancelRaffleByAdmin;
        vm.getRafflesList = getRafflesList;
        vm.updateRaffle = updateRaffle;

        activate();

        function activate() {
            getRafflesList();
        }

        /**
         * Получение списка всех розыгрышей
         */
        function getRafflesList() {
            vm.getUrl = '/api/adm/raffle/list?orderBy='+vm.orderData+'&orderDirection='+vm.orderDirection+'&page=0&perPage=1000&active='+vm.active+'&finished='+vm.finished+'&reject='+vm.rejected+'&name='+vm.searchName;
            vm.waiterGetHttp = true;

            $http.get(vm.getUrl)
                .then(function(response){
                    vm.rafflesList = response.data.data;
                    vm.waiterGetHttp = false;
                })
                .catch(function(){
                    vm.waiterGetHttp = false;
                })
        }

        /**
         * Сортировка списка розыгрышей по статусу
         * @param row - весь объест розыгрыша, откуда берется его статус
         * @returns {boolean} - возвращает true для отображение розыгрыша, в зависимости от выбранных параметров, или false для его скрытия
         */
        function sortByCategory(row) {
            if (vm.finished && row.finished == true) return true;
            if (vm.rejected && row.reject == true) return true;
            if (vm.active && row.active == true && row.finished == false && row.reject == false) return true;
        }

        /**
         * Отмена розыгрыша
         * @param row - весь объект розыгрыша, откуда берется ID розыгрыша
         */
        function cancelRaffleByAdmin(row) {
            var postUrl = '/api/adm/raffle/' + row.id + '/cancel';
            $http.post(postUrl, {})
                .then(getRafflesList)
                .then(function(){
                    // noty.show('Розыгрыш отменен',"error"); // Показ всплывающего уведомления
                    Notification.error({message: 'Розыгрыш отменен', delay: 1000});
                })
        }

        function updateRaffle(row){
            $rootScope.postRaffleDataForUpdate = row;
            $location.url('/admin/raffle/update');
        }

    }})();
