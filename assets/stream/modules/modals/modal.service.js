(function () {
    'use strict';

    angular
        .module('streampub')
        .service('modalService', modalService);

    modalService.$inject = ['$uibModal', '$rootScope'];

    function modalService($uibModal, $rootScope) {
        var vm = this;
        vm.openModal = openModal;


        /**
         * Открытие кастомного модального окна
         * @param templateId (string) - имя шаблона
         * @param modalData (obj)- любые данные в формате JSON. Доступ к ним в модальном окне осуществляется через vm.mo
         * @param size (string) - размер окна - lg, md, sv
         * @param personalTpl (string) - персоналдьный шаблон, лежащий где-то в папке. Указывается имя
         * @param redirectUrl (stirng) - ссылка для редиректа куда угодно. Если она есть, то в $rootScope.redirectUrl передастся URL для редиректа
         * @returns {Window|*|{height}}
         */
        function openModal(templateId, modalData, size, personalTpl, redirectUrl, options) {
            var options = options || {};
            $rootScope.redirectUrl = redirectUrl ? redirectUrl : window.location.pathname;
            var modalInstance = $uibModal.open({
                templateUrl: personalTpl ? '/modals/tpls/' + personalTpl + '/' + templateId + '.html' : '/modals/tpls/' + templateId + '.html',
                size: size || 'md',
                backdrop: angular.isUndefined(options.backdrop) ? true : options.backdrop ,
                backdropClass: options.backdropClass,
                windowClass: options.class || 'gaModal',
                controller: options.controller || 'ModalDefaultController',
                controllerAs: 'vm',
                resolve: {
                    modalData: function () {
                        return modalData || {};
                    }
                }
            });
            return modalInstance;
        }
    }

})();