(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('wgfestController', wgfestController);

    wgfestController.$inject = ['$http'];

    function wgfestController($http) {
        var vm = this;
        vm.myCode = undefined;

        vm.getCode = getCode;

        activate();

        ////////////////

        function activate() {
            getCount();
            
        }

        function getCount(){
            $http.get('/api/statistics/wgfest/members')
                .then(function(data){
                    vm.usersCount = data.data.members;
                })
        }

        function getCode() {
            $http.post('/api/code',{})
                .then(function(data){
                    vm.myCode = data.data.data.code;
                })

        }

    }
})();