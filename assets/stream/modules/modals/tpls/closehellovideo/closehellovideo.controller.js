(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('closeHelloVideoController', closeHelloVideoController);

    closeHelloVideoController.$inject = ['intercomService'];

    function closeHelloVideoController(intercomService) {
        var vm = this;
        
        vm.openvideo = openvideo;

        function openvideo(){
            intercomService.emit('openVideoInRaffeAfterHelloBanner');
        }

    }

})();