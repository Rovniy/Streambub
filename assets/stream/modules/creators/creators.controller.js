(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('creatorsController', creatorsController);

    creatorsController.$inject = ['$routeParams', '$sce', '$http','preloader','$rootScope'];

    function creatorsController($routeParams, $sce, $http,preloader,$rootScope) {
        var vm = this;
        vm.streamerId = $routeParams.creatorId;
        vm.creatorData = {};
        vm.activeImg = 0;
        vm.description = {};
        vm.rating1 = 1;
        vm.rating2 = 1;
        vm.rating3 = 1;
        vm.commentDis = false;
        vm.commentFilter = '';
        vm.streamerRaffles = [];
        vm.awardsLimit = 5; //Количество отображаемых достижений
        vm.videosLimit = 6; //Количество отображаемых видео
        vm.rafflesLimit = 5; //Количетсво отображаемых розыгрышей
        vm.mediaReferencesLimit = 3; //Количетсво отображаемых упоминаний в СМИ
        vm.rateFunction = rateFunction;
        vm.descFunction = descFunction;
        vm.checkSocial = checkSocial;
        vm.findMainGame = findMainGame;
        vm.postComment = postComment;
        vm.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        vm.closeVideoFrame = closeVideoFrame;
        vm.commentsFilter = commentsFilter;
        vm.checkSocialLinks = checkSocialLinks;

        activate();
        
        function activate() {
            getStreamerData();
            getCommentsList();
        }


        // Определение URL для стрима и чата
        function getStreamUrls() {
            var status = 'true';
            if ($rootScope.user) {
                if ($rootScope.user.userData.role === 'ADMIN' || $rootScope.user.userData.role === 'STREAMER') {
                    status = 'false';
                }
            }
            //Определение URL стрима
            vm.streamUrl = 'https://player.twitch.tv/?channel='+ vm.streamerData.name + '&autoplay=' + status;
            vm.stream = $sce.trustAsResourceUrl(vm.streamUrl);

            //Определение URL чата
            vm.streamChatUrl = 'https://www.twitch.tv/'+vm.streamerData.name+'/chat?autoplay=' + status;
            vm.streamChat = $sce.trustAsResourceUrl(vm.streamChatUrl);
        }


        function getStreamerData() {
            preloader.act('creatorsController-getStreamerData');
            var getUrl = '/api/creator/' + vm.streamerId;
            $http.get(getUrl)
                .then(function(response){
                    vm.streamerData = response.data.data;
                    vm.streamerAccountId = vm.streamerData.user.id;
                    preloader.dis('dashboard-getBudget', response.data);
                })
                .then(daysFunction)
                .then(getStreamUrls)
                .then(getStreamersRaffles)
                .then(setStyle)
                .catch(function(response){
                    preloader.dis('dashboard-getBudget', response.data);
                })
        }

        // Определение типа страницы стримера
        function setStyle() {
            if (vm.streamerData.communication == 'OFFICIAL') vm.streamerData.communication = 'Формальный';
            if (vm.streamerData.communication == 'INFORMAL') vm.streamerData.communication = 'Неформальный';
            if (vm.streamerData.communication == 'OBSCENE') vm.streamerData.communication = '16+';
        }

        // Список розыгрышей стримера
        function getStreamersRaffles() {
            var getUrl = '/api/raffles/'+ vm.streamerAccountId;
            $http.get(getUrl)
                .then(function(response){
                    vm.streamerRaffles = response.data.data;
                })

        }

        // Возвращем обписания стримера по требованию
        function descFunction(type, lang) {
            vm.descTextData = {};
            if (vm.streamerData) {
                vm.streamerData.description.forEach(function(f){
                    if (f.type == type && f.lang == lang) {
                        vm.descTextData = f;
                    }
                });
                return vm.descTextData.text;
            }
        }

        // Календарь стримов
        function daysFunction() {
            vm.monday = null;
            vm.tuesday = null;
            vm.wednesday = null;
            vm.thursday = null;
            vm.friday = null;
            vm.saturday = null;
            vm.sunday = null;
            vm.streamerData.broadcastings.forEach(function(f){
                if (f.day == 'MONDAY') {
                    vm.monday = f;
                } else if (f.day == 'TUESDAY') {
                    vm.tuesday = f;
                } else if (f.day == 'WEDNESDAY') {
                    vm.wednesday = f;
                } else if (f.day == 'THURSDAY') {
                    vm.thursday = f;
                } else if (f.day == 'FRIDAY') {
                    vm.friday = f;
                } else if (f.day == 'SATURDAY') {
                    vm.saturday = f;
                } else if (f.day == 'SUNDAY') {
                    vm.sunday = f;
                }
            });
        }

        // Получение социальных кнопок
        function checkSocial(type) {
            var data = undefined;
            vm.streamerData.platformLinks.forEach(function(f){
                if (f.platformType == type) {
                    data = f;
                }
            });
            if (data != undefined) {
                return true;
            }
        }

        // Поиск основной игры
        function findMainGame() {
            var data = undefined;
            var game;
            if (vm.streamerData) {
                vm.streamerData.streamerGames.forEach(function(f){
                    if (f.main == true) {
                        switch (f.game.id) {
                            case 4 : game = 'hs';
                                break;
                            case 5 : game = 'csgo';
                                break;
                            case 7 : game = 'wot';
                                break;
                            case 6 : game = 'dota2';
                                break;
                            case 8 : game = 'lol';
                                break;
                            case 9 : game = 'letsplay';
                                break;
                        }
                        data = '/src/img/base/icons/'+ game +'.png';
                    }
                });
                if (data != undefined) {
                    return data;
                }
            }
        }

        // Отправка комментария о стримере
        function postComment(comment) {
            if (comment) {
                var postUrl = 'api/creator/'+ vm.streamerId +'/comment';
                var data = {
                    text: comment
                };
                $http.post(postUrl, data)
                    .then(function(){
                        vm.comment = 'Твой отзыв отправлен. Спасибо ;)';
                        vm.commentDis = true;
                    })
                    .then(getCommentsList)
            }
        }

        // Вызов функции для отображения плеера Youtube
        function onYouTubeIframeAPIReady(videoId) {
            vm.showVideoIframe = true;
            vm.player = undefined;
            vm.videoId = videoId;
            vm.player = new YT.Player('player', {
                videoId: videoId ? videoId : 'vsfSwztvV9o',
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
                }
            });
        }

        // Закрытие видео
        function closeVideoFrame() {
            vm.player.destroy();
            vm.showVideoIframe = false;
        }

        // Оценка страницы стримера
        function rateFunction(feature) {
            setTimeout(function(){
                var val;
                if (feature == 'INTERACTIVE') val = vm.rating1;
                if (feature == 'SKILL') val = vm.rating2;
                if (feature == 'CHARISMA') val = vm.rating3;
                var postUrl = 'api/creator/'+ vm.streamerId +'/vote';
                var data = {
                    feature: feature,
                    value: val
                };
                $http.post(postUrl, data);
            },500);

        }

        // Получение списка комментов
        function getCommentsList() {
            var getUrl = 'api/creator/'+ vm.streamerId +'/comments?page=0&limit=10';
            $http.get(getUrl)
                .then(function(response){
                    vm.commentsList = response.data.data;
                    vm.commentsList.forEach(function(f){
                        if (f.interactive == 0) f.interactive = 1;
                        if (f.skill == 0) f.skill = 1;
                        if (f.charisma == 0) f.charisma = 1;
                    })
                })
        }

        // Фильтрация комментариев по звездочкам
        function commentsFilter(item) {
            if (vm.commentFilter == 'up') {
                return (item.interactive + item.skill + item.charisma >= 9);
            } else if (vm.commentFilter == 'down') {
                return (item.interactive + item.skill + item.charisma < 9);
            } else if (vm.commentFilter == '') {
                return true;
            }
        }

        function checkSocialLinks(id) {
            if (vm.streamerData) {
                return vm.streamerData.platformLinks.filter(function(item){
                    return item.platformType == id;
                })
            }
        }
    }
})();