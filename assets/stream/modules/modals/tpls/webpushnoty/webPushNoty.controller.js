(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('webPushNotyController', slowBalanceController);

    slowBalanceController.$inject = [];

    function slowBalanceController() {
        var vm = this;
        vm.webPushNotyActivate = webPushNotyActivate;

        function webPushNotyActivate(){

        }


    }

})();