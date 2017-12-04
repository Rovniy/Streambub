(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('popupRestoreController', popupRestoreController);

    popupRestoreController.$inject = ['authenticationService', 'modalService'];

    function popupRestoreController(authenticationService, modalService) {
        var vm = this;
        vm.step = 'form';
        vm.restorePassword = restorePassword;

        function restorePassword(email) {
            authenticationService.restorePswrd(email)
                .then(function(){
                    vm.step = 'ok';
                    vm.email = '';
                })
                .catch(function(response){
                    ///TODO...
                    vm.email = '';
                    /*if () {

                    }*/
                })
        }
    }

})();