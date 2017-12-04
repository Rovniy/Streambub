(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('slowBalanceController', slowBalanceController);

    slowBalanceController.$inject = ['modalService'];

    function slowBalanceController(modalService) {
        var vm = this;
        vm.openSecondModal = openSecondModal;

        function openSecondModal(){
            console.log('открываю вторую модаолку');
            //modalService.openModal('webPushNoty', {}, 'md', 'webpushnoty');
        }


    }

})();