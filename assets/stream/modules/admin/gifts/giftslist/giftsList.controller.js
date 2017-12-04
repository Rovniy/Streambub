(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminGiftsList', adminGiftsList);

    adminGiftsList.$inject = ['userService','$location', 'preloader', '$http','config'];

    function adminGiftsList(userService,$location, preloader, $http,config) {
        var vm = this;
        vm.config = config;

        vm.sortReverce = false; // Направление сортировки
        vm.orderData = 'name';
        vm.active = true;

        vm.switchShow = switchShow;
        vm.sortByCategory = sortByCategory;
        vm.saveValue = saveValue;
        vm.savePromo = savePromo;

        activate();

        function activate() {
            getGiftsList();
        }

        function getGiftsList() {
            $http.get('/api/adm/gift/list?page=0&perPage=1000')
                .then(function(response){
                    vm.giftList = response.data.data;
                })
        }

        function switchShow(row) {
            var postUrl = '/api/adm/gift/' + row.id + '/active';
            $http.post(postUrl, {})
                .then(function(){
                    row.active = !row.active;
                })
        }

        function sortByCategory(row) {
            if (vm.active && row.active == true) return true;
            if (vm.hidden && !row.active == true) return true;
        }

        /**
         * Сохранение ограничений для стримера при событиии ng-blur.
         * @params obj row - весь объект стримера со всеми потрохами
         */
        function saveValue(row) {
            var data = {
                discountPrice: row.discountPrice ? row.discountPrice : null,
                discountMinMembers: row.discountMinMembers ? row.discountMinMembers : null
            };
            var postUrl = '/api/adm/gift/' + row.id + '/update';
            $http.post(postUrl, data)
                .then(function(){
                    vm.giftList.forEach(function(f){
                        if (f.id == row.id) {
                            f.postSuccess = true;
                        }
                    })
                })
                .catch(function(){
                    console.error('adminGiftsList-saveValue');
                })
        }

        function savePromo(row){
            var data = {promo: row.promo};
            var postUrl = '/api/adm/gift/' + row.id + '/update';
            $http.post(postUrl, data)
                .catch(function(){
                    console.error('adminGiftsList-saveValue');
                })
        }

    }})();
