(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('cpaMeshesViboomController', cpaMeshesViboomController);

    cpaMeshesViboomController.$inject = ['$routeParams','$http','intercomService','$scope'];

    function cpaMeshesViboomController($routeParams,$http,intercomService,$scope) {
        var vm = this;
        vm.routeParams = $routeParams;
        vm.status = {
            platformId: 72630, //ID нашей платформы в CPA сетке VIBOOM
            luck: 0,
            playerShow: true
        };
        vm.timer = 0;
        vm.videoStart = false;

        vm.backToRaffle = backToRaffle;
        vm.secToTime = secToTime;

        activate();

        ////////////////

        function activate() {
            getGlobalTasks();
        }

        /**
         * Получение данных о розыгрыше, в котором находится таск VIBOOM
         */
        function getGlobalTasks() {
            var url = '/api/global/task';
            $http.get(url)
                .then(function(response) {
                    vm.gaData = response.data.data;
                })
                .then(findCurrenttask)
                .then(createViboomPlayer)
                .then(getVideoDuration)
                .then(getPlayerStart)
                .then(finishPlayVideo)
        }

        /**
         * Поиск данных таска внутри данных о розыгрыше
         */
        function findCurrenttask() {
            if (vm.gaData) {
                vm.gaData.forEach(function(f){
                    if (f.id == vm.routeParams.taskid) {
                        vm.currentTask = f;
                    }
                })
            }
        }

        /**
         * Создание плеера VIBOOM
         */
        function createViboomPlayer() {
            vbm('get', {
                "platformId": vm.status.platformId,
                "format": 2,
                "align": "top",
                "width": "700",
                "height": "480",
                "sig": vm.currentTask.id
            }, {
                controls: 0
            });
            getVideoDuration();
        }

        /**
         * Обработчик окончания просмотра видео
         */
        function finishPlayVideo(){
            vbm('on', vm.currentTask.id, 'playerFinish', function(){
                sentRespFromSocial(vm.currentTask.taskType, {id:vm.currentTask.id, interval: vm.videoDuration}, vm.currentTask.luck);
            });
        }

        /**
         * Получение длительности одного видео
         */
        function getVideoDuration(){
            vbm('on', vm.currentTask.id, 'playerReady', function(player){
                vm.timer = player.getDuration();
                vm.videoDuration = player.getDuration();
                console.log('vm.timer',vm.timer);
                $scope.$apply();
            });
        }

        /**
         * Получение статуса начала воспроизведения видео
         */
        function getPlayerStart() {
            vbm('on',vm.currentTask.id, 'playerStart', function(){
                vm.videoStart = true;
            })
        }

        /**
         * Отправка отчета о выполнении таска
         * @param social - тип таска (VIBOOM)
         * @param data - объект с ID таска
         * @param luck - количество лака, которое добавляется за выполнение таска
         */
        function sentRespFromSocial(social,data,luck) {
            var getUrl = '/api/global/' + social;
            $http.post(getUrl, data)
                .then(function () {
                    vm.status.luck += luck;
                    vm.videoStart = false;
                })
                .then(intercomPushLuck)
                .then(checkVideo)
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
         * Проверка наличия видео для просмотра
         */
        function checkVideo() {
            vbm('on', vm.currentTask.id, 'content', function(campaignId){
                if (!campaignId) {
                    console.log('Новых видео нет');
                    vm.timer = false;
                    vm.status.playerShow = false;
                    vm.videoStart = false;
                }
            });
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