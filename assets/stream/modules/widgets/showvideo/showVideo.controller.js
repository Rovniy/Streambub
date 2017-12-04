(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('showVideoController', showVideoController);

    showVideoController.$inject = ['$rootScope','$routeParams','$location','$scope','intercomService','$http'];

    function showVideoController($rootScope,$routeParams,$location,$scope,intercomService,$http) {
        var vm = this;
        vm.videoId = $routeParams.videoId;
        vm.raffleId = '/' + $routeParams.raffleId;
        vm.userId = $routeParams.userId;
        vm.showVideo = true;
        vm.firstStart = true;
        vm.timer = 0;

        vm.secToTime = secToTime;
        vm.startCounter = startCounter;

        activate();

        function activate() {
            $rootScope.widgetOpen = true;
            setTimeout(onYouTubeIframeAPIReady, 1000);
        }


        $scope.$watch('vm.showVideo', function(){
            if (vm.showVideo == false) {
                vm.firstStart = false;
                $location.url(vm.raffleId);
            }
        });

        // Вызов функции для отображения плеера Youtube
        function onYouTubeIframeAPIReady() {
            console.log('111');
            if (vm.firstStart) {
                vm.player = undefined;
                vm.player = new YT.Player('player', {
                    videoId: vm.videoId,
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                        disablekb: 1,
                        fs:0,
                        iv_load_policy:3,
                        modestbranding: 1,
                        showinfo: 0,
                        playsinline: 1,
                        rel: 0
                    },
                    events: {
                        'onReady': videoTimerCounter,
                        'onStateChange': checkEndStatus
                    }
                });
            }
        }

        // Счетчик времени видео
        function videoTimerCounter(event) {
            vm.videoDuration = event.target.getDuration();
        }

        function startCounter() {
            vm.videoInterval = setInterval(function(){
                vm.videoDuration--;
                $scope.$apply();
                if(vm.videoDuration == 0) {
                    clearInterval(vm.videoInterval);
                }
            }, 1000)
        }

        // Окончание просмотра видео
        function checkEndStatus(event) {
            console.log(event.target.getPlayerState());
            if (event.target.getPlayerState() == 0){
                event.target.stopVideo();
                vm.player = null;
                endShowVideo();
            }
            if (event.target.getPlayerState() == 2){
                event.target.playVideo();
            }
            if (event.target.getPlayerState() == 3){
                startCounter()
            }
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

        // Остановка воспроизведения
        function endShowVideo() {
            vm.showVideo = false;
            var postUrl = 'api/video' + vm.raffleId + '/' + vm.userId + '/' + vm.videoId;
            $http.post(postUrl, {})
                .then(function(){
                    vm.showVideo = false;
                    $scope.$apply();
                })
        }
    }
})();