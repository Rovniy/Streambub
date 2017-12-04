(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('codeImageModalController', codeImageModalController);

    codeImageModalController.$inject = ['$scope', '$rootScope','intercomService'];

    function codeImageModalController($scope, $rootScope,intercomService) {
        var vm = this;
        vm.myAnswer = undefined;
        vm.items = $rootScope.codeImageModal;

        vm.postAnswer = postAnswer;

        /**
         * Отправка ответа через Intercom в тело розыгрыша для выбора ответа
         * @param id - ID моего ответа из модалки
         */
        function postAnswer(id){
            intercomService.emit('send-Response-From-Image-Code-Modal',{task: vm.items.row, key: vm.items.key, id:id});
            $scope.$dismiss();
        }
    }

})();