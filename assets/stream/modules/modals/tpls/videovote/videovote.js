(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('videoVoteController', videoVoteController);

    videoVoteController.$inject = ['$rootScope','intercomService'];

    function videoVoteController($rootScope, intercomService) {
        var vm = this;
        vm.counter = 0;
        
        vm.pushResponse = pushResponse;

/*
        vm.player1 = 'https://www.youtube.com/embed/' + $rootScope.videoVoteData.params.list[0];
        vm.player1ToTrust = $sce.trustAsResourceUrl(vm.player1);

        vm.player2 = 'https://www.youtube.com/embed/' + $rootScope.videoVoteData.params.list[1];
        vm.player2ToTrust = $sce.trustAsResourceUrl(vm.player2);
*/
        activate();

        function activate() {
            setTimeout(function() {
                player1($rootScope.videoVoteData.params.list[0]);
                player2($rootScope.videoVoteData.params.list[1]);
            },500);
        }

        // Вызов функции для отображения плеера Youtube
        function player1(videoId) {
            console.log('player1');
            vm.player1 = undefined;
            vm.videoId1 = videoId;
            vm.player1 = new YT.Player('player1', {
                videoId: videoId ? videoId : 'vsfSwztvV9o',
                height: '300',
                width: '419',
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
                    'onReady': function () {
                        console.log('player1')
                    },
                    'onStateChange': checkEndStatus
                }
            });
        }
        
        function checkEndStatus(event) {
            if (event.target.getPlayerState() == 0){
                vm.counter++;
                console.log('cm.counter');
                event.target.stopVideo();
            } else if (event.target.getPlayerState() == 2){
                event.target.playVideo();
            }
        }

        // Вызов функции для отображения плеера Youtube
        function player2(videoId) {
            console.log('player2');
            vm.player2 = undefined;
            vm.videoId2 = videoId;
            vm.player2 = new YT.Player('player2', {
                videoId: videoId ? videoId : 'vsfSwztvV9o',
                height: '300',
                width: '419',
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
                    'onReady': function () {
                        console.log('player2')
                    },
                    'onStateChange': checkEndStatus
                }
            });
        }
        
        function pushResponse(row) {
            $rootScope.videoVoteResult = row;
            intercomService.emit('checkVideoVote');
        }

    }

})();