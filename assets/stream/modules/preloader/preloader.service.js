(function () {
    'use strict';

    angular
        .module('streampub')
        .service('preloader', preloader);

    preloader.$inject = ['Notification', 'config', '$rootScope'];

    function preloader(Notification, config, $rootScope) {
        this.act = act;
        this.dis = dis;
        $rootScope.preloaderCounter = 0; // Начальное значение счетчика прелоадера

        // Включение прелоадера
        function act(from) {
            ++$rootScope.preloaderCounter;
            //if (config.debug) console.log('Preloader : + :',$rootScope.preloaderCounter,':',from);
            activate();
        }

        // Попытка выключения прелоадера
        function dis(from, data) {
            --$rootScope.preloaderCounter;
            //if (config.debug) console.log('Preloader : - :',$rootScope.preloaderCounter,':', from, data ? data : '');
            if(data){
                if (data.message !== undefined) {
                    if (config.debug) {
                        console.log('Noty - Error :', data.type, ':', data.message);
                        /**
                         * Всплывающие подсказки на сайте
                         */
                        //noty.show(from + ' --> ' + data.type + ' --> ' + data.message,"error");
                        Notification.error(from + ' --> ' + data.type + ' --> ' + data.message)

                    }
                }
            }
            if ($rootScope.preloaderCounter <= 0) {
                disable();
            }

        }

        // Включаем прелоадер в контроллере
        function activate() {
            Intercom.getInstance().emit('showPreloader');
        }

        // Выключаем прелоадер в контроллере
        function disable() {
            Intercom.getInstance().emit('hidePreloader');
        }
    }

})();

