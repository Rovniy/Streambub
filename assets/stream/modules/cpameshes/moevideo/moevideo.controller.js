(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('cpaMeshesMoevideoController', cpaMeshesMoevideoController);

    cpaMeshesMoevideoController.$inject = ['$routeParams','$http','intercomService','$window','$scope'];

    function cpaMeshesMoevideoController($routeParams,$http,intercomService,$window,$scope) {
        var vm = this;
        vm.routeParams = $routeParams;
        vm.noVideo = false;
        vm.iHaveLuckNow = false;

        $window.checkVideoStatus = checkVideoStatus;
        vm.backToRaffle = backToRaffle;

        activate();

        ////////////////

        function activate() {
            vm.myMoevideoLuck = parseInt(sessionStorage.getItem('myMoevideoLuck')) || 0;
            getRaffle();
        }

        function getRaffle() {
            var url = '/api/global/task';
            $http.get(url)
                .then(function(response) {
                    vm.gaData = response.data.data;
                })
                .then(findCurrenttask)
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
         * Отправка через Intercom инфы о начислении LUCK пользователю за выполнению ЦД
         */
        function intercomPushLuck(){
            var data = {
                luck: parseInt(vm.myMoevideoLuck.luck)
            };
            intercomService.emit('global-luck-add-from-cpameshes', data);
        }


        function checkVideoStatus(event) {
            console.log('проверяю статус');
            if (event == 'finish') {
                console.log('посмотрел', event, vm.currentTask);
                postTaskStatus(vm.currentTask);
            } else if (event == 'empty') {
                console.log('ошибка', event);
                vm.noVideo = true;
                $scope.$apply();
            } else if (event == 'load') {
                console.log('загрузился', event);
                vm.iHaveLuckNow = true;
                $scope.$apply();
            } else if (event == 'start') {
                console.log('загрузился', event);
            }


        }

        /**
         * Отправка отчета о выполнении таска
         * @param task - объект таска
         */
        function postTaskStatus(task) {
            var getUrl = '/api/global/' + task.taskType;
            var data = {
                id: task.id
            };
            console.log('отправляю и перезагружаюсь');
            $http.post(getUrl, data)
                .then(function () {
                    vm.myMoevideoLuck = parseInt(vm.myMoevideoLuck) + parseInt(task.luck);
                    sessionStorage.setItem('myMoevideoLuck',vm.myMoevideoLuck);
                    intercomPushLuck();
                })
                .then(location.reload())
        }

        /**
         * Закрытие вкладки для возврата к розыгрышу
         */
        function backToRaffle() {
            window.close();
        }
    }
})();