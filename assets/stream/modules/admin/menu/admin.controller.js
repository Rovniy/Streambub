(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminController', adminController);

    adminController.$inject = ['intercomService', 'config', 'modalService'];

    function adminController(intercomService, config, modalService) {
        var vm = this;

        vm.config = config;
        vm.raffleOpenHelloModal = raffleOpenHelloModal;
        vm.openLoginModal = openLoginModal;
        vm.openRegistrationModal = openRegistrationModal;
        vm.raffleShowYoutube = raffleShowYoutube;
        vm.openRestoreModal = openRestoreModal;
        vm.emulateRaffleProcess = emulateRaffleProcess;
        vm.faqRaffleInfo = faqRaffleInfo;
        vm.advRegistration = advRegistration;
        vm.firstsession = firstsession;
        vm.modalCpaLongResponse = modalCpaLongResponse;
        vm.modalUploadImage = modalUploadImage;

        activate();

        function activate() {

        }

        function raffleOpenHelloModal() {
            intercomService.emit('raffle.open.helloModal');
        }

        function openLoginModal() {
            modalService.openModal('popupLogin', '', 'md', 'popuplogin')
        }

        function openRegistrationModal() {
            modalService.openModal('popupRegistration', '', 'md', 'popupregistration')
        }

        function openRestoreModal() {
            modalService.openModal('popupRestore', '', 'md', 'popuprestore')
        }

        function raffleShowYoutube() {
            intercomService.emit('raffle.show.youtubeVideo');
        }

        function emulateRaffleProcess(type){
            var data = {
                id:'49402238-c578-41f9-974c-381fa4d6fc58',
                test: true,
                type: type
            };
            intercomService.emit('raffleStart', data);
        }

        function faqRaffleInfo() {
            modalService.openModal('faqRaffleInfo', '', 'md', 'faqraffleinfo')
        }

        function advRegistration() {
            modalService.openModal('advregistration', '', 'md', 'advRegistration')
        }

        function firstsession() {
            modalService.openModal('firstsession', '', 'lg', 'firstsession','firstsessionModalController');
        }

        function modalCpaLongResponse() {
            modalService.openModal('cpacdnoncomplete', {url: '//vk.com'}, 'md', 'cpacdnoncomplete');
        }

        function modalUploadImage() {
            modalService.openModal('uploadImage', {}, 'md', 'upload-image');
        }



    }})();
