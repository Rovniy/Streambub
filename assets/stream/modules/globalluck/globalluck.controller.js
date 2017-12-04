(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('globalLuckController', globalLuckController);

    globalLuckController.$inject = ['$http','preloader','authenticationService','$sce','modalService','$scope','config','$rootScope','intercomService','$location'];

    function globalLuckController($http,preloader,authenticationService,$sce,modalService,$scope,config,$rootScope,intercomService,$location) {
        var vm = this;

        vm.checkStatus = [];
        vm.myStatus = [];
        vm.myCodeAnswer = [];
        vm.responseError = [];
        vm.adBlockerInfo = 'Для выполнения этого задания необходимо выключить блокировщик рекламы, установленный в твоем браузере. После отключения обнови страницу';

        vm.postTaskStatus = postTaskStatus;
        vm.findMyTaskStatus = findMyTaskStatus;
        vm.checkMyNewStatus = checkMyNewStatus;
        vm.connectAccount = connectAccount;
        vm.subscribeVK = subscribeVK;
        vm.to_trusted = to_trusted;
        vm.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        vm.secToTime = secToTime;
        vm.getVideoLink = getVideoLink;
        vm.closeVideoFrame = closeVideoFrame;
        vm.enterCodeAnswer = enterCodeAnswer;
        vm.myStatusCodeError = myStatusCodeError;

        activate();

        ////////////////

        function activate() {
            getTasksList();
            checkMyStatus();
            mayBelogin();

            /**
             * обработка события траты лака
             */
            intercomService.on('global-luck-spend', spendGlobalLuck);
            
            /**
            * обработка события начисления лака из внешних окон
            */
            intercomService.on('global-luck-add-from-cpameshes', function(data){
                vm.myStatus.luck = vm.myStatus.luck + data.luck;
                intercomService.emit('global-luck-add',{luck: data.luck});
            });
            
        }

        // Логин через твитч
        function mayBelogin() {
            setTimeout(function () {
                if (!$rootScope.user) modalService.openModal('popupLogin', '', 'md', 'popuplogin');
            }, 2000);
        }

        /**
         * Получение списка всех доступнях тасков
         */
        function getTasksList() {
            preloader.act('globalLuckController-getTasksList');
            $http.get('/api/global/task')
                .then(function(response){
                    vm.tasksList = response.data.data;
                    preloader.dis('globalLuckController-getTasksList');
                })
                .catch(function (response) {
                    console.log('Ошибка получения данных о статусе', response);

                    preloader.dis('globalLuckController-getTasksList');
                });
        }

        /**
         * Получение списка выполненных мною тасков
         */
        function checkMyStatus() {
            preloader.act('globalLuckController-checkMyStatus');
            $http.get('/api/global/task/me')
                .then(function(response){
                    vm.myStatus = response.data.data;
                    console.log('vm.myStatus',vm.myStatus);
                    preloader.dis('globalLuckController-checkMyStatus');
                })
                .catch(function (response) {
                    console.log('Ошибка получения данных о статусе', response);
                    preloader.dis('globalLuckController-checkMyStatus');
                });
        }

        /**
         * Проверка ЦД на неверный ответ на квест "CODE"
         * @param id - id таска
         * @returns {boolean} - возвращает true, если был дан неверный ответ на вопрос
         */
        function myStatusCodeError(id) {
            var error = false;
            if (vm.myStatus) {
                if (vm.myStatus.tasks) {
                    vm.myStatus.tasks.forEach(function (f) {
                        if (f.taskType == 'CODE' && f.luck == 0 && f.id == id) {
                            error = true;
                        }
                    });
                    if (error) return true;
                }
            }
        }

        /**
         * Уменьшение количества глобального лака
         * @param data - {luck: XXXX}
         */
        function spendGlobalLuck(data) {
            console.log('вычитаю немного лака', data.luck);
            vm.myStatus.luck = vm.myStatus.luck - data.luck;
            if (vm.myStatus.luck < 0) vm.myStatus.luck = 0;
            $scope.$apply();
        }

        /**
         * Вызов функции для отображения плеера Youtube
         * @param row - целый объект целевого действия
         */
        function onYouTubeIframeAPIReady(row,key) {
            vm.videoDuration = 0;
            var luck = row.luck, videoId = row.id;
            if (row.params) {
                if (row.params.interval) {
                    if (localStorage.getItem(row.id)) {
                        console.log('localStorage.getItem(row.id)');
                        var counter = localStorage.getItem(row.id);
                        var oldTime = localStorage.getItem(row.id + '_date');
                        var currentTime = new Date();
                        if (oldTime) {
                            if (((Date.parse(currentTime) - Date.parse(oldTime)) / 1000) > row.params.interval * 60) {
                                console.log('время прошло меньше');
                                vm.player = undefined;
                                vm.videoId = videoId;
                                vm.youtubeLuck = luck;
                                vm.showVideoIframe = true;
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
                                    },
                                    events: {
                                        'onReady': videoTimerCounter,
                                        'onStateChange': checkEndStatus
                                    }
                                });
                            } else {
                                console.log('время прошло бошльше');
                                if (counter < row.params.quantity) {
                                    console.log('количество просмотров меньше');
                                    vm.player = undefined;
                                    vm.videoId = videoId;
                                    vm.youtubeLuck = luck;
                                    vm.showVideoIframe = true;
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
                                        },
                                        events: {
                                            'onReady': videoTimerCounter,
                                            'onStateChange': checkEndStatus
                                        }
                                    });
                                } else {
                                    modalService.openModal('default', {
                                        head: 'Есть ограничение',
                                        text: 'Ты можешь выполнять этот квест не чаще, чем ' + row.params.quantity + ' раз(а) в ' + row.params.interval + ' минут(ы).'
                                    }, 'md', 'default');
                                }
                            }
                        }
                    } else {
                        console.log('не нашел в локалке ничего');
                        localStorage.setItem(row.id, 1);
                        localStorage.setItem(row.id + '_date', new Date());
                        vm.player = undefined;
                        vm.videoId = videoId;
                        vm.youtubeLuck = luck;
                        vm.showVideoIframe = true;
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
                            },
                            events: {
                                'onReady': videoTimerCounter,
                                'onStateChange': checkEndStatus
                            }
                        });
                    }
                }
            } else {
                vm.player = undefined;
                vm.videoId = videoId;
                vm.youtubeLuck = luck;
                vm.showVideoIframe = true;
                vm.videoDisableAfterPost = key;
                vm.player = new YT.Player('player', {
                    videoId: videoId ? videoId : 'vsfSwztvV9o',
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        iv_load_policy: 3,
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

        /**
         * Получение длительности видео при его загрузке
         * @param event - событие из YouTube-плеера
         */
        function videoTimerCounter(event) {
            vm.videoDuration = event.target.getDuration();
        }

        /**
         * Окончание просмотра видео
         * @param event - событие из YouTube-плеера
         */
        function checkEndStatus(event) {
            /**
             * 0 - окончание видео
             * 2 - состояние паузы
             * 3 - запуск видео при клике на кнопку
             */
            if (event.target.getPlayerState() == 0){
                event.target.stopVideo();
                endShowVideo();
            } else if (event.target.getPlayerState() == 2){
                event.target.playVideo();
            } else if (event.target.getPlayerState() == 3){
                startTimer();
            }
        }

        /**
         * Запуск таймера видео. Вызывается при изменении статуса YouTube-плеера на 3
         */
        function startTimer() {
            vm.videoInterval = setInterval(function(){
                vm.videoDuration--;
                $scope.$apply();
                if(vm.videoDuration == 0) {
                    //endShowVideo();
                    clearInterval(vm.videoInterval);
                }
            }, 1000)
        }

        /**
         * Остановка воспроизведения видео путем окончания таймера продолжительности видео
         */
        function endShowVideo() {
            vm.youtubeOk = false;
            vm.showVideoIframe = false;
            vm.videoDuration = 0;
            if (vm.player) {
                postTaskStatus(
                    {
                        taskType: 'VIDEO',
                        id: vm.videoId,
                        luck: vm.youtubeLuck
                    })
            } else if (vm.randomPlayer) {
                postTaskStatus(
                    {
                        taskType: 'VIDEO_CAROUSEL',
                        id: vm.videoId,
                        luck: vm.youtubeLuck
                    })
            }
            if (vm.player) {
                vm.player.destroy();
                vm.player = undefined;
            } else if (vm.randomPlayer) {
                vm.randomPlayer.destroy();
                vm.randomPlayer = undefined;
            }
            clearInterval(vm.videoInterval);

            // Повышение кол-ва просмтров видосов
            var videoShowedId = localStorage.getItem(vm.videoId) + 1;
            localStorage.setItem(vm.videoId, videoShowedId);
            localStorage.setItem(vm.videoId + '_date', new Date());

            config.debug ? console.log('завершил просмотр') : null;
        }

        /**
         * Конвертер секунд в юзабильный вид
         * @param sec - длительность видео в секундах, получаемого из плеера YouTube
         * @returns {string} - возвращает оставшееся время воспроизведения, в формате "XX:XX сек"
         */
        function secToTime(sec) {
            var dt = new Date();
            dt.setTime(sec*1000);
            return dt.getUTCMinutes()+":"+dt.getUTCSeconds();
        }

        /**
         * Закрытие полноэкранного видео нажатие на крестик при просмотре
         */
        function closeVideoFrame() {
            vm.youtubeOk = false;
            if (vm.player) {
                vm.player.destroy();
                vm.player = undefined;
            } else if (vm.randomPlayer) {
                vm.randomPlayer.destroy();
                vm.randomPlayer = undefined;
            }
            clearInterval(vm.videoInterval);
            vm.showVideoIframe = false;
            vm.videoDuration = 0;
        }

        // Запрос ссылки, которой можно поделиться с друщьями
        function getVideoLink(task, videoId, luck, count) {
            var videoUrl = {
                url: 'https://' + window.location.host + '/' + 'video/global-luck/' + $rootScope.user.userData.id + '/' + videoId,
                luck: luck,
                count: count
            };
            modalService.openModal('showVideoLink', videoUrl, 'md', 'showvideolink');
        }

        /**
         * Отправка ответа на вопрос из ЦД
         * @param row - весь объект ЦД
         * @param data - объект с ответом, вида {code: XXXXX}
         */
        function enterCodeAnswer(row, data, key) {
            postTaskStatus({
                id: row.id,
                taskType: row.taskType,
                code: data.code,
                luck: row.luck
            }, key);
        }

        /**
         * Пост данных о выполнении таска
         * @param task
         */
        function postTaskStatus(task, key) {
            var postUrl = '/api/global/' + task.taskType;
            var data;
            /******************** проверка на taskType *********************/
            if (task.taskType == 'SUBSCRIBE_VK') {
                data = task.data;
            } else {
                data = {
                    id: task.id,
                    code: task.code ? task.code : undefined
                };
            }
            $http.post(postUrl, data)
                .then(function(response){
                    vm.responseError[key] = false;
                    if (task.taskType === 'FOLLOW_TWITCH') {
                        if (response.data.data.params) {
                            if (response.data.data.params.oldFollower != undefined) {
                                vm.tasksList[key].newLuck = response.data.data.luck;
                            }
                        }
                    }
                    if (task.taskType === 'CPA') {
                        vm.tasksList[key].newLuck = response.data.data.luck;
                    }
                    if (task.taskType == 'CODE' && response.data.data.luck == 0) {
                        vm.responseError[key] = true;
                        vm.waiter[key] = false;
                        vm.myCodeAnswer[key] = undefined;
                    }
                    if (task.taskType == 'VIDEO') {
                        if (vm.videoDisableAfterPost) {
                            vm.tasksList[vm.videoDisableAfterPost].disable = true;
                            vm.videoDisableAfterPost = undefined;
                        }
                    }
                    if (!vm.responseError[key]) {
                        if (vm.tasksList[key]) {
                            if (vm.tasksList[key].newLuck != undefined) {
                                vm.myStatus.luck = vm.myStatus.luck + vm.tasksList[key].newLuck;
                            } else {
                                vm.myStatus.luck = vm.myStatus.luck + task.luck;
                            }
                        }
                        var newStatus = {
                            name: task.taskType,
                            id:  task.id ? task.id : null,
                            status: true
                        };
                        vm.checkStatus.push(newStatus);
                        console.log('vm.checkStatus',vm.checkStatus);
                        intercomService.emit('global-luck-add',{luck: task.luck});
                    }
                })
                .catch(function(response){
                    preloader.dis('raffleController-checkUsers',response.data);
                });
        }

        // Получение моего статуса о задании
        function findMyTaskStatus(task, id) {
            if (vm.myStatus) {
                if (vm.myStatus.tasks){
                    return vm.myStatus.tasks.filter(function(f){
                        if (id) {
                            if (f.taskType == task && f.id == id) return true;
                        } else {
                            if (f.taskType == task) return true;
                        }
                    })
                } else {
                    return [];
                }
            }
        }

        /**
         *
         * @param html_code
         * @returns {any}
         */
        function to_trusted(html_code) {
            return $sce.trustAsHtml(html_code);
        }

        // Проверка моего статуса
        function checkMyNewStatus(social, id) {
            if (vm.checkStatus){
                return vm.checkStatus.filter(function(f){
                    if (id) {
                        if (f.name == social && f.id == id) return true;
                    } else {
                        if (f.name == social) return true;
                    }
                })
            }
        }

        // проверка подписки на группу ВК
        function subscribeVK(social,group_id,groupName, luck) {
            VK.Auth.getLoginStatus(function (response) {
                if (response.session) {
                    postTaskStatus({
                        id: group_id,
                        taskType: social,
                        data: {uid:response.session.mid,id:group_id,name:groupName},
                        luck: luck
                    })
                } else {
                    VK.Auth.login(function (resp) {
                        if (resp.session) {
                            postTaskStatus({
                                id: group_id,
                                taskType: social,
                                data: {uid:resp.session.user.id,groupId:group_id,name:groupName},
                                luck: luck
                            })
                        } else {
                            console.log("Not autorize", response);
                        }
                    }, 1);
                }
            });
        }

        // Подключение нового аккаунта
        function connectAccount(provider) {
            authenticationService.externalLogin(provider, '/global-luck');
        }
    }
})();

