(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('cpaMeshesVideoseedController', cpaMeshesVideoseedController);

    cpaMeshesVideoseedController.$inject = ['$routeParams','$http','intercomService','$window','$scope'];

    function cpaMeshesVideoseedController($routeParams,$http,intercomService,$window,$scope) {
        var vm = this;
        $window.onVSAPIReady = onVSAPIReady; //Функция обязательно должна быть объектом $window, чтобы обработчик был вызван из тела сайта
        vm.routeParams = $routeParams;
        vm.status = {
            luck: 0,
            playerShow: true
        };
        vm.videoStart = false;
        vm.timer = 0;
        vm.duration = 0;
        vm.weHaveError = true;

        vm.backToRaffle = backToRaffle;
        vm.secToTime = secToTime;

        activate();

        ////////////////

        function activate() {
            getRaffle();
        }

        /**
         * Получение данных о розыгрыше, в котором находится таск VIBOOM
         */
        function getRaffle() {
            var url = '/api/global/task';
            $http.get(url)
                .then(function(response) {
                    vm.gaData = response.data.data;
                })
                //Поиск данных таска внутри данных о розыгрыше
                .then(function(){
                    if (vm.gaData) {
                        vm.gaData.forEach(function(f){
                            if (f.id == vm.routeParams.taskid) {
                                vm.currentTask = f;
                            }
                        })
                    }
                    // Создание тела плеера VIDEOSEED
                    if (vm.currentTask) generatePlayer();
                })
        }

        /**
         * Создание тела плеера VIDEOSEED
         */
        function generatePlayer() {
            var id = 's-' + vm.routeParams.taskid;
            console.log(id);
            var s = document.getElementById(id);
            s.id = + new Date() + Math.floor(Math.random() * 1000) + '-vseed';
            var v = document.createElement('script');
            v.type = 'text/javascript';
            v.async = true;
            v.src = 'https://fseed.ru/oO/rotator?align=1&height=450&width=800&key='+vm.routeParams.taskid+'&pid=41523&csid=' + s.id;
            console.log('v.src',v.src);
            v.charset = 'utf-8';
            s.parentNode.insertBefore(v, s);
        }

        /**
         * Обработка событий VIDEOSEED плеера
         * @param player - объект плеера
         */
        function onVSAPIReady(player){
            /**
             * 'onLoaded': - окончание загрузки видео
             * 'onVideoStart': - запуск воспроизведения
             * 'onVideoComplete' - окончание воспроизведения
             * 'onSkip' - пропуск видео
             * 'onClickThru' - нажатие на кнопку PLAY в видеоплеере
             * 'onError' - ошибка при получении видео
             */
            player.events = {
                'onVideoStart': onVideoStart,
                'onVideoComplete' : myOnVideoComplete,
                'onError': myOnVideoError
            };
        }

        function onVideoStart(reponse) {
            vm.weHaveError = false;
            vm.videoStart = true;
            $scope.$apply();
            sessionStorage.setItem('overlay-videoseed-waiter',reponse.detail.player.getRemainingTime());
            vm.timer = reponse.detail.player.getRemainingTime();
            vm.duration = reponse.detail.player.getDuration();
            timeoutResponse();
        }

        function myOnVideoError(response) {
            vm.weHaveError = true;
            console.log('myOnVideoCompleteError',response)
        }


        /**
         * Обработка окончания просмотра видео
         */
        function myOnVideoComplete() {
            vm.videoStart = false;
            $scope.$apply();
            sessionStorage.removeItem('overlay-videoseed-waiter');
        }

        /**
         * Таймер для отображения блокирующего DIV'a
         */
        function timeoutResponse() {
            var remainingTime = 20; // % от длительности видео, после которого отправляется отчет о просмотре
            var time = sessionStorage.getItem('overlay-videoseed-waiter');
            var interval = setInterval(function(){
                if (vm.timer < time*remainingTime/100) {
                    vm.videoStart = false;
                    $scope.$apply();
                    sessionStorage.removeItem('overlay-videoseed-waiter');
                    sentRespFromSocial(vm.currentTask.taskType,{id: $routeParams.taskid}, vm.currentTask.luck);
                    clearInterval(interval);
                } else {
                    vm.timer--;
                }
            },1000)
        }

        /**
         * Отправка отчета о выполнении таска
         * @param social - тип таска - taskType (VIBOOM)
         * @param data - объект с ID таска
         * @param luck - количество лака, которое добавляется за выполнение таска
         */
        function sentRespFromSocial(social,data,luck) {
            var getUrl = 'api/global/' + social;
            $http.post(getUrl, data)
                .then(function () {
                    vm.status.luck += luck;
                })
                .then(intercomPushLuck)
        }

        /**
         * Отправка через Intercom инфы о начислении LUCK пользователю за выполнению ЦД
         */
        function intercomPushLuck(){
            var data = {
                luck: vm.status.luck
            };
            intercomService.emit('global-luck-add-from-cpameshes', data);
        }

        /**
         * Закрытие вкладки для возврата к розыгрышу
         */
        function backToRaffle() {
            window.close();
        }


        /**
         * Конвертер секунд в юзабильный вид
         * @param sec - длительность видео в секундах, получаемого из плеера YouTube
         * @returns {string} - возвращает оставшееся время воспроизведения, в формате "XX:XX сек"
         */
        function secToTime(sec){
            var dt = new Date();
            dt.setTime(sec*1000);
            return dt.getUTCMinutes()+":"+dt.getUTCSeconds();
        }

    }
})();