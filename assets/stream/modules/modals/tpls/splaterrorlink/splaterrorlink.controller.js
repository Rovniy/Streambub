(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('splatErrorLinkController', splatErrorLinkController);

    splatErrorLinkController.$inject = ['modalService'];

    function splatErrorLinkController(modalService) {
        var vm = this;

        vm.helpModal = helpModal;
        
        function helpModal(social) {
            if (social == 'vk') {
                modalService.openModal('helpmodalvk','','md','helpmodalvk')
            } else if (social == 'facebook') {
                modalService.openModal('helpmodalfacebook','','md','helpmodalfacebook')
            } else if (social == 'twitter') {
                modalService.openModal('helpmodaltwitter','','md','helpmodaltwitter')
            } else if (social == 'instagram') {
                modalService.openModal('helpmodalinstagram','','md','helpmodalinstagram')
            }
        }
    }
})();