(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminAddStreamer', adminAddStreamer);

    adminAddStreamer.$inject = ['preloader','userService','$location','FileUploader','$http'];

    function adminAddStreamer(preloader,userService,$location,FileUploader,$http) {
        var vm = this;
        vm.streamerGames = [];
        vm.streamerPlatform = [];
        vm.videos = [];
        vm.images = [];
        vm.streamDays = [];
        vm.uploader = new FileUploader({
            url: '/api/files/upload'
        });
        vm.descProfile = {};
        vm.descFacts = {};
        vm.descBio = {};
        vm.week = {};
        vm.media = {};
        vm.awards = {};
        vm.awardsList = [];
        vm.mediaReference = [];
        vm.userName = '';
        vm.pageType = '';
        vm.skillValue = '';
        vm.userAccount = undefined;

        vm.addGame = addGame;
        vm.removeGame = removeGame;
        vm.addPlatform = addPlatform;
        vm.removePlatform = removePlatform;
        vm.addVideo = addVideo;
        vm.removeVideo = removeVideo;
        vm.addStreamDay = addStreamDay;
        vm.removeStreamDay = removeStreamDay;
        vm.createPage = createPage;
        vm.addMediaReference = addMediaReference;
        vm.removeMediaReference = removeMediaReference;
        vm.addAward = addAward;
        vm.removeAward = removeAward;
        vm.createPageWithoutImg = createPageWithoutImg;

        activate();

        function activate() {
            checkAdminRules();
            getStreamers();
            getGames();
        }

        vm.uploader.onSuccessItem = function(response) {
            var resp = JSON.parse(response._xhr.response);
            vm.images.push(resp.data.value[0].value);
        };


        function getGames() {
            $http.get('/api/games')
                .then(function(response){
                    vm.gamesData = response.data.data;
                })
        }

        // Получение списка стримеров
        function getStreamers() {
            $http.get('/api/adm/streamers?page=0&perPage=1&searchString')
                .then(function(response){
                    var getUrl = '/api/adm/streamers?page=0&perPage='+ response.data.data.count +'&searchString';
                    $http.get(getUrl)
                        .then(function(response){
                            vm.usersList = response.data.data.userInfos;
                        })
                })
        }
        // Проверка юзера на админа
        function checkAdminRules() {
            preloader.act('adminStreamersStreamersList');
            if (!userService.isAdmin()) {
                preloader.dis('adminStreamersStreamersList');
                $location.url('/');
            } else {
                preloader.dis('adminStreamersStreamersList');
            }
        }

        function addGame(id) {
            vm.selectedGame = '';
            vm.gamesData.forEach(function(f){
                if (f.id == id) {
                    vm.selectedGame = f.name;
                }
            });
            var data = {
                gameId: id,
                main: false,
                game: vm.selectedGame
            };
            vm.streamerGames.push(data);
        }

        function removeGame(key) {
            vm.streamerGames.splice(key,1);
        }

        function addPlatform(type,link) {
            var data = {
                type: type,
                link: link
            };
            vm.streamerPlatform.push(data);
        }

        function removePlatform(key) {
            vm.streamerPlatform.splice(key,1);
        }

        function addVideo(text,url) {
            var data = {
                name: text,
                link: url
            };
            vm.videos.push(data);
        }

        function removeVideo(key) {
            vm.videos.splice(key,1);
        }

        function addStreamDay(day, from, to) {
            var data = {
                day: day,
                from: from,
                to: to
            };
            vm.streamDays.push(data);
        }

        function removeStreamDay(key) {
            vm.streamDays.splice(key,1);
        }

        function createPage() {
            vm.uploader.uploadAll();
        }

        vm.uploader.onCompleteAll = function() {
            createPageWithoutImg();
        };

        function createPageWithoutImg() {
            vm.error = undefined;
            var data = {
                name: vm.userName,
                gender: vm.gender,
                communication: vm.pageType,
                mainPlatform: vm.mainPlatform,
                interactive: vm.interactive,
                skill: vm.skill,
                charisma: vm.charisma,
                gameExperience: vm.skillValue,
                games: vm.streamerGames,
                platformLinks: vm.streamerPlatform,
                mediaReferences: vm.mediaReference,
                awards: vm.awardsList,
                userId: vm.userAccount ? vm.userAccount : null,
                description: [
                    {
                        lang: 'ru',
                        type: 'PROFILE',
                        text: vm.descProfile.ru
                    },
                    {
                        lang: 'en',
                        type: 'PROFILE',
                        text: vm.descProfile.en
                    },
                    {
                        lang: 'ru',
                        type: 'FACTS',
                        text: vm.descFacts.ru
                    },
                    {
                        lang: 'en',
                        type: 'FACTS',
                        text: vm.descFacts.en
                    },
                    {
                        lang: 'en',
                        type: 'BIOGRAPHY',
                        text: vm.descBio.en
                    },
                    {
                        lang: 'ru',
                        type: 'BIOGRAPHY',
                        text: vm.descBio.ru
                    }
                ],
                images: vm.images,
                videos: vm.videos,
                broadcastings: vm.streamDays
            };
            $http.post('/api/creator/create', data)
                .then(function(){
                    vm.success = 'OK';
                })
                .catch(function(response){
                    vm.error = response.data;
                });
        }

        function addMediaReference(day, name, description, link) {
            if (day && name && description && link) {
                var data = {
                    date: day,
                    name: name,
                    description: description,
                    link: link
                };
                vm.mediaReference.push(data);
            }

        }

        function removeMediaReference(key) {
            vm.mediaReference.splice(key,1);
        }


        function addAward(day, text) {
            if (day && name) {
                var data = {
                    date: day,
                    text: text
                };
                vm.awardsList.push(data);
            }

        }

        function removeAward(key) {
            vm.awardsList.splice(key,1);
        }

    }})();
