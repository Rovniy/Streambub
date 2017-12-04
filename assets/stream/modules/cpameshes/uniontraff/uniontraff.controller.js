(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('cpaMeshesUniontraffController', cpaMeshesUniontraffController);

    cpaMeshesUniontraffController.$inject = ['$routeParams','$http','$scope','intercomService'];

    function cpaMeshesUniontraffController($routeParams,$http,$scope,intercomService) {
        var vm = this;
        vm.error = false;
        vm.status = {
            luck: 0,
            playerShow: false
        };
        vm.videoStart = false;
        vm.routeParams = $routeParams;

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
         * Создание листенера
         */
        function createPlayer() {
            if (window.addEventListener) {
                window.addEventListener("message", postMessageReceive);
            } else {
                window.attachEvent("onmessage", postMessageReceive);
            }
            vm.status.playerShow = true;
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
         * Проверка финального состояния плеера
         * @param event - событие из плеера
         */
        function postMessageReceive (event){
            if (event.origin == 'http://uniontraff.com' || event.origin == 'https://uniontraff.com') {
                if(event.data=='start_content'){
                    sentRespFromSocial('UT',{id:vm.currentTask.id},vm.currentTask.luck);
                    console.log('cpaMeshesUnionstaffController - End')
                }
                if (event.data=='no_ads') {
                    var element = document.getElementById("utPlayer");
                    element.parentNode.removeChild(element);
                    vm.error = true;
                    vm.status.playerShow = false;
                    $scope.$apply();
                    console.log('cpaMeshesUnionstaffController - No_Ads');
                }
            }
        }

        /**
         * Отправка отчета о выполнении таска
         * @param social - тип таска (UT)
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