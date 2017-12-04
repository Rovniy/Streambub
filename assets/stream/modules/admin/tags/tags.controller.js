(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminTagsController', adminTagsController);

    adminTagsController.$inject = ['$http'];

    function adminTagsController($http) {
        var vm = this;
        vm.sortReverce = true;
        vm.created = true;
        vm.applied = true;
        vm.canceled = true;

        vm.activatePost = activatePost;
        vm.cancelPost = cancelPost;
        vm.deletePost = deletePost;
        vm.reverseSort = reverseSort;
        vm.sortByCategory = sortByCategory;

        activate();

        function activate() {
            getTagsList();
        }

        function getTagsList(){
            var getUrl = '/api/adm/social/list?page=0&perPage=10000&orderBy=createTime&orderDirection=DESC';
            $http.get(getUrl)
                .then(function(response){
                    vm.tagsData = response.data.data;
                })
        }

        function activatePost(id, key){
            var postUrl = '/api/adm/social/' + id + '/accept';
            $http.post(postUrl, {})
                .then(function(response){
                    vm.tagsData[key].status = 'APPLIED';
                })
        }

        function cancelPost(id, key){
            var postUrl = '/api/adm/social/' + id + '/cancel';
            $http.post(postUrl, {})
                .then(function(response){
                    vm.tagsData[key].status = 'CANCELED';
                })
        }

        function deletePost(id, key){
            var postUrl = '/api/adm/social/' + id + '/delete';
            $http.post(postUrl, {})
                .then(function(response){
                    vm.tagsData.splice(key,1);
                })
        }

        function reverseSort(time) {
            var getUrl;
            vm.sortReverce = !vm.sortReverce;
            if (vm.sortReverce == true) {
                getUrl = '/api/adm/social/list?page=0&perPage=10000&orderBy='+time+'&orderDirection=DESC';
                $http.get(getUrl)
                    .then(function(response){
                        vm.tagsData = response.data.data;
                    })
            } else {
                getUrl = '/api/adm/social/list?page=0&perPage=10000&orderBy='+time+'&orderDirection=ASC';
                $http.get(getUrl)
                    .then(function(response){
                        vm.tagsData = response.data.data;
                    })
            }
        }

        function sortByCategory(row) {
            if (row.status == 'CREATED' && vm.created) return true;
            if (row.status == 'APPLIED' && vm.applied) return true;
            if (row.status == 'CANCELED' && vm.canceled) return true;
        }

    }})();
