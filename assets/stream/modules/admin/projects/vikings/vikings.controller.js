(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('projectVikingsController', projectVikingsController);

    projectVikingsController.$inject = ['$http'];

    function projectVikingsController($http) {
        var vm = this;
        vm.addLuck = [];
        vm.created = true;

        vm.applyImage = applyImage;
        vm.revertImage = revertImage;
        vm.deleteImage = deleteImage;
        vm.sortByCategory = sortByCategory;

        activate();

        function activate() {
            getTagsList();
        }

        function getTagsList(){
            var getUrl = '/api/adm/upload/list?page=0&perPage=10000&orderBy=createTime&orderDirection=DESC';
            $http.get(getUrl)
                .then(function(response){
                    vm.uploadList = response.data.data;
                })
        }

        function applyImage(row,key) {
            var postUrl = '/api/adm/upload/' + row.id + '/accept/' + vm.uploadList[key].addLuck;
            $http.post(postUrl, {})
                .then(function(){
                    vm.uploadList[key].applySuccess = true;
                    vm.uploadList[key].status = 'APPLIED';
                })
        }

        function revertImage(row,key) {
            var postUrl = '/api/adm/upload/' + row.id + '/cancel';
            $http.post(postUrl, {})
                .then(function(){
                    vm.uploadList[key].applyDanger = true;
                    vm.uploadList[key].status = 'CANCELED';
                })
        }

        function deleteImage(row,key) {
            var postUrl = '/api/adm/upload/' + row.id + '/delete';
            $http.post(postUrl, {})
                .then(function(){
                    vm.uploadList.splice(key,1);
                    $scope.$apply();
                })
        }

        function sortByCategory(row) {
            if (row.status == 'CREATED' && vm.created) return true;
            if (row.status == 'APPLIED' && vm.applied) return true;
            if (row.status == 'CANCELED' && vm.canceled) return true;
        }

    }})();
