(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('headmoderationController', headmoderationController);

    headmoderationController.$inject = [];

    function headmoderationController() {
        var vm = this;
        vm.doNotShowAgain = doNotShowAgain;
        
        function doNotShowAgain(){
            localStorage.setItem('doNotShowTagWindow', 'true');
        }
    }

})();