(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('cpaMeshesNativerollController', cpaMeshesNativerollController);

    cpaMeshesNativerollController.$inject = ['$routeParams','$http','intercomService','$scope'];

    function cpaMeshesNativerollController($routeParams,$http,intercomService,$scope) {
        var vm = this;
        vm.routeParams = $routeParams;
        vm.videoStart = false;
        vm.playerError = false;
        vm.status = {
            luck: 0,
            playerShow: true
        };

        vm.backToRaffle = backToRaffle;

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
                .then(createPlayer)
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
         * Создание плеера SeedrPlayer
         */
        function createPlayer() {
            SeedrPlayer(document.getElementById('playerArea'), 20, {
                gid: '5892c9275f366ee1718b4595',
                debug: false,
                onLoad: function() {
                    vm.videoStart = true;
                    $scope.$apply();
                },
                onVideoComplete: function () {
                    sentRespFromSocial('NR',{id: vm.currentTask.id},vm.currentTask.luck)
                },
                onError: function (error) {
                    console.log('error', error);
                    vm.playerError = true;
                    $scope.$apply();
                }
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
    }
})();