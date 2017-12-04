(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('ModalDefaultController', ModalDefaultController);

    ModalDefaultController.$inject = ['$uibModalInstance', 'modalData', 'intercomService'];

    function ModalDefaultController($uibModalInstance, modalData, intercomService) {
        var vm = this;
        
        vm.openvideo = openvideo;

        vm.items = modalData;

        vm.ok = function () {
            $uibModalInstance.close(vm.selected.item);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        function openvideo(){
            intercomService.emit('openVideoInRaffeAfterHelloBanner');
        }
    }
})();