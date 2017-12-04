(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('dashboardWithdrawalController', dashboardWithdrawalController);

    dashboardWithdrawalController.$inject = ['$http','$rootScope'];

    function dashboardWithdrawalController($http,$rootScope) {
        var vm = this;
        vm.step1 = true;
        vm.withdrawal = 0;
        vm.withdrawalValue = '';

        vm.goWithdrawal = goWithdrawal;

        activate();

        ////////////////

        function activate() {
            getMyGain();
        }

        function getMyGain() {
            $http.get('/api/transaction/gain')
                .then(function(response){
                    vm.withdrawal = response.data.data.value;
                })
        }

        function goWithdrawal(summ) {
            var currency;
            if ($rootScope.getLanguage() == 'RU') {
                currency = 'RUB';
            } else if ($rootScope.getLanguage() == 'EN') {
                currency = 'USD'
            }
            var data = {
                value: summ,
                message: 'Способ вывода  - ' + $rootScope.withdrawalSource + '. Валюта вывода: ' + $rootScope.getLanguage(),
                currency: currency
            };
            $http.post('/api/transaction/withdraw', data)
                .then(function(){
                    vm.step1 = false;
                })

        }
    }

})();