/**
 * Andrew (Ravy) Rovniy
 * 17.01.2017
 * Raffle Page Controller
 */
(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('raffleController', raffleController);

        raffleController.$inject = [
            '$http',
            'preloader',
            '$location',
            '$routeParams',
            '$sce',
            'authenticationService',
            '$rootScope',
            'intercomService',
            'userService',
            'modalService',
            'config',
            '$scope',
            '$cookies',
            '$q'
        ];

        function raffleController(
            $http,
            preloader,
            $location,
            $routeParams,
            $sce,
            authenticationService,
            $rootScope,
            intercomService,
            userService,
            modalService,
            config,
            $scope,
            $cookies,
            $q
        ) {

        var vm = this;
        vm.gaId = $routeParams.gaid;
        vm.config = config;
        vm.usersData= [];
        vm.defaultAvatar = '/src/img/avatars/avatar_default.jpg';
        vm.checkStatus = [];
        vm.myTasksList = [];
        vm.postSaveSettingsError = false;
        vm.selectRaffleType = false;
        vm.targetList = [];
        vm.dateFormat = 'dd-MMMM-yyyy';
        vm.datePicker = false;
        vm.showViboomVideo = {};
        vm.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };
        vm.altInputFormats = ['M!/d!/yyyy'];
        vm.checkSocialTooltip = 'Проверка может занять до 5 минут. Твой лак будет добавлен автоматически';
        vm.checkCPATooltip = 'Ура, ты начал выполнять квест! Luck будет начислен автоматически после выполнения задания в течение 20 минут.';
        vm.adBlockerInfo = 'Для выполнения этого задания необходимо выключить блокировщик рекламы, установленный в твоем браузере. После отключения обнови страницу';
        vm.showChance = true; //Начальная позиция зеленой кнопки с квестами. false - закрыта, true - открыта
        vm.waiter = [];
        vm.carouselArray = [];
        vm.newLenta = [];
        vm.winnerUrl = [];
        vm.mySocialPostLink = [];
        vm.myCodeAnswer = [];
        vm.responseError = [];
        vm.responseUploadWaitModeration = [];
        vm.actionLimit = 5;
        vm.zeroRatingValue = 0;
        vm.ratingValue = 0;
        vm.videoDuration = 0;
        vm.videoFromHelloBanner = 0; // 0
        vm.questCurrentLevel = 1; // 1
        vm.raffleWithVideoVote = false; // false
        vm.raffleWithTagFirstRaffle = false;
        vm.startRaffleMembers = 100000000; //просто большая цифра для поиска числа участников для старта розыгрыша
        vm.isAdmin = userService.isAdmin;
        vm.globalLuckDisable = false;
        vm.globalLuckWait = false;

        vm.addToActionsList = addToActionsList;
        vm.deleteFromTargetList = deleteFromTargetList;
        vm.saveChanges = saveChanges;
        vm.selectAnyItem = selectAnyItem;
        vm.rollRaffle = rollRaffle;
        vm.joinRaffle = joinRaffle;
        vm.changeConfigName = changeConfigName;
        vm.postSocial = postSocial;
        vm.findMyTaskStatus = findMyTaskStatus;
        vm.subscribeVK = subscribeVK;
        vm.likeFb = likeFb;
        vm.checkMyNewStatus = checkMyNewStatus;
        vm.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        vm.closeVideoFrame = closeVideoFrame;
        vm.authVk = authVk;
        vm.findSecretTag = findSecretTag;
        vm.showChanceTooltip = showChanceTooltip;
        vm.getVideoLink = getVideoLink;
        vm.lentaChance = lentaChance;
        vm.lentaChancePrefix = lentaChancePrefix;
        vm.openSlowBalanceModal = openSlowBalanceModal;
        vm.enterSocialLink = enterSocialLink;
        vm.connectAccount = connectAccount;
        vm.helpModal = helpModal;
        vm.to_trusted = to_trusted;
        vm.comebackTask = comebackTask;
        vm.checkComebackStatus = checkComebackStatus;
        vm.playRandomVideo = playRandomVideo;
        vm.findRandomVideo = findRandomVideo;
        vm.questNextStep = questNextStep;
        vm.videoVote = videoVote;
        vm.showByLevel = showByLevel;
        vm.secToTime = secToTime;
        vm.simpleYouTubePlayer = simpleYouTubePlayer;
        vm.setLocalStorageTag = setLocalStorageTag;
        vm.getLocalStorageTag = getLocalStorageTag;
        vm.showModalHelper = showModalHelper;
        vm.enterCodeAnswer = enterCodeAnswer;
        vm.enterSite = enterSite;
        vm.switchShowChance = switchShowChance;
        vm.pushLuckToraffle = pushLuckToraffle;
        vm.myStatusCodeError = myStatusCodeError;
        vm.myStatusImageCodeError = myStatusImageCodeError;
        vm.openImageCodeModal = openImageCodeModal;
        vm.openUploadImageFromModal = openUploadImageFromModal;
        vm.cdUploadWaitModeration = cdUploadWaitModeration;

        activate();

        ////////////////

        function activate() {
            checkGiveAway(); // получение розыгрыша
            checkUsers(); // получение участников

            intercomService.on('raffleReload', raffleReload); // команда на перезагрузку данных о розыгрыше
            intercomService.on('openVideoInRaffeAfterHelloBanner', playVideoFromHellowBanner);
            intercomService.on('addSomeLuckToUser', addSomeLuckToUser);
            intercomService.on('checkVideoVote', function(){
                if ($rootScope.videoVoteData && $rootScope.videoVoteResult) {
                    vm.raffleWithVideoVote = false;
                    sentRespFromSocial('VIDEO_VOTE',{id: $rootScope.videoVoteData.id,video: $rootScope.videoVoteResult},$rootScope.videoVoteData.luck)
                }
            });
            intercomService.on('global-luck-add',checkGlobalLuckCounter);
            intercomService.on('send-Response-From-Image-Code-Modal',getResponseFromImageCodeModal);
            intercomService.on('complete-Upload-Image-From-Modal',completeUploadImageFromModal);

            $scope.$watch('vm.questCurrentLevel', function(){
                if (vm.questCurrentLevel == 4) {
                    vm.videoFromHelloBanner = 0;
                }
            });
        }

        /**
         * Добавление LUCK пользователю за выполнение ЦД из других вкладок
         * @param data - инфа по выполненному ЦД:
         * @string id - ID розыгрыша
         * @int luck - количество добавляемого LUCK
         */
        function addSomeLuckToUser(data) {
            if (vm.gaData.id == data.id) {
                vm.myStatus.luck = vm.myStatus.luck + data.luck;
            }
        }

        /**
         * Получения ключа для отображения модального окна с инструкцией по розыгрышу
         */
        function getLocalStorageModalKey(){
            if (vm.myStatus.organizer) {
                var key = localStorage.getItem('hideRaffleModal');
                if (!key) {
                    modalService.openModal('firstsession', '', 'lg', 'firstsession','firstsessionModalController');
                }
            }
        }

        /**
         * Открытие модального окна с подсказками по розыгрышу
         */
        function showModalHelper() {
            modalService.openModal('firstsession', '', 'lg', 'firstsession','firstsessionModalController');
        }

        // Получение данных по розыгрышу
        function checkGiveAway() {
            preloader.act('raffleController-checkGiveAway');
            var url = '/api/raffle/' + vm.gaId;
            $http.get(url)
                .then(function(response){
                    vm.gaData =  response.data.data;

                    if (vm.gaData.playDate) {
                        vm.gaDate = vm.gaData.playDate;
                    } else {
                        vm.gaDate = undefined;
                    }
                    if (vm.gaData.stats.minMembers == 0) vm.gaData.stats.minMembers = 1;

                    individualOg(); // Изменение META-информации о странице

                    vm.gaData.gifts.forEach(function(a){
                        a.gift.campaign.brandings.forEach(function(f){
                            if (f.type === 'BACKGROUND') {
                                vm.coverImg = f.src;
                            }
                            if (f.type === 'TOP_BANNER') {
                                vm.bannerImg = f.src;
                            }
                            if (f.type == 'MODAL') {
                                vm.modalBg = f.src;
                            }
                        });
                        if (a.active == true) {
                            vm.activeGift = a;
                        }
                        // Поиск наименьшего числа участников для первого подарка
                        if (a.minMembers < vm.startRaffleMembers) {
                            vm.startRaffleMembers = a.minMembers;}
                    });
                    
                    if (vm.gaData.tags) {
                        vm.gaData.tags.forEach(function(f){
                            if (f == 'vote') {
                                vm.raffleWithVideoVote = true; //Розыгрыш с квестом для голосования за видео
                            } else if (f == 'allYouWant') {
                                vm.raffleWithTagFirstRaffle = true; //Розыгрыш с тегом "allYouWant". Это розыгрыш с призом-коробкой
                            } else if (f == 'first') {
                                $rootScope.itIsMyFirstRaffle = true; //Розыгрыш с тегом "first". Это первый розыгрыш стримера
                            }
                        })
                    }

                    vm.configName = vm.activeGift.gift.name + ' #' + vm.gaData.name;
                    if (localStorage.getItem('quest-' + vm.gaData.shortLink)){
                        vm.questStatus = localStorage.getItem('quest-' + vm.gaData.shortLink);
                    }
                    setComebackDate(vm.gaData.shortLink);
                })
                .then(checkWaitTimeBeforeStart)
                .then(getMyTasksList)
                .then(checkMyStatus)
                .then(findAutoCheckCdready)
                .then(getLoadPercentData)
                .then(actionsListRun)
                .then(getStreamersCanCreateTasks)
                /*.then(getLocalStorageModalKey)*/
                /*.then(getUserCount)*/
                .then(function() {
                    /*getStreamUrls();*/
                    preloader.dis('raffleController-checkGiveAway');
                })
                .catch(function (response) {
                    console.log('Ошибка получения розыгрыша');
                    $location.url('/');        //TODO
                    preloader.dis('raffleController-checkGiveAway', response.data);
                });
        }

        /**
         * Поиск счетчика обратного отсчета до возможности запустить розыгрыш
         */
        function checkWaitTimeBeforeStart() {
            if (vm.gaData) {
                var interval = setInterval(function(){
                    vm.gaData.startCountDown -= 1;
                    $scope.$apply();
                    if (vm.gaData.startCountDown <= 0) {
                        clearInterval(interval);
                        vm.gaData.startCountDown = 0;
                    }
                },1000)
            }
        }
            
        /**
         * Подстановка нужных ID в ссылку на рекламодателя
         */
        function replaceBannersLinks(){
            $q.when(userService.getUserProfile()).then(function () {
                if (vm.myStatus) {
                    vm.activeGift.gift.campaign.sponsor.link = vm.activeGift.gift.campaign.sponsor.link.replace('[memberId]', vm.myStatus.id);
                } else {
                    vm.activeGift.gift.campaign.sponsor.link = vm.activeGift.gift.campaign.sponsor.link.replace('[memberId]', $rootScope.user.userData.id);
                }
                vm.activeGift.gift.campaign.sponsor.link = vm.activeGift.gift.campaign.sponsor.link.replace('[raffleLink]', vm.gaData.shortLink);
            });
        }

        // Получение списка участников
        function checkUsers() {
            /*preloader.act('raffleController-checkUsers');
            var url = '/api/raffle/'+ vm.gaId +'/last';
            $http.get(url)
                .then(function(response){
                    vm.usersData =  response.data.data.partipiant;
                    preloader.dis('raffleController-checkUsers');
                })
                .catch(function (response) {
                    console.log('Ошибка получения участники розыгрыша');
                    preloader.dis('raffleController-checkUsers',response.data);
                });*/
        }

        // Автовступление в розыгрыш после входа
        function autoJoin() {
            preloader.act('raffleController-autoJoin');
            if (sessionStorage.getItem('autoJoin')) {
                sessionStorage.removeItem('autoJoin');
                vm.config.debug ? console.log('Получил данные из sessionStorage - autoJoin') : null;
                joinRaffle();
                preloader.dis('raffleController-autoJoin');
            } else {
                preloader.dis('raffleController-autoJoin');
            }

        }

        // Получение списка действий
        function getActionsList () {
            var getUrl = '/api/statistics/activity/' + vm.gaData.id;
            return $http.get(getUrl)
                .then(function(response){
                    vm.actionsList = response.data.data;
                    if(!vm.actionsRepeat) {
                        for (var y = 0; y < vm.actionLimit; y++) {
                            vm.newLenta.push(vm.actionsList[y]);
                        }
                    }
                });
        }

        // Перебор списка всех действий
        function actionsListRun() {
            getActionsList()
                .then(function(){
                    var i = 2, time = 5000;
                    var interval = setInterval(function () {
                        i++;
                        vm.newLenta.push(vm.actionsList[i]);
                        $scope.$apply();
                        if (vm.newLenta.length == vm.actionsList.length) {
                            vm.newLenta = [];
                            for (var y = vm.actionLimit; y > 0; y--) {
                                vm.newLenta.push(vm.actionsList[vm.actionsList.length - y]);
                            }
                            vm.actionsRepeat = true;
                            i = 2;
                            clearInterval(interval);
                            actionsListRun();
                        }
                    }, time);
                });
        }

        // Эксперимент. Проверка наличия тэга FLOWER в розыгрыше для отображение кол-ва участников в процентах
        function findSecretTag(word) {
            var ok = false;
            if (vm.gaData) {
                if (vm.gaData.tags) {
                    vm.gaData.tags.forEach(function(f){
                        if (f == word) {
                            ok = true;
                        }
                    });
                }
            }
            return ok;
        }

        // Заполнение розыгрыша участниками
        function getLoadPercentData() {
            if (vm.gaData.stats.activeMembers <= vm.gaData.minMembers) {
                vm.loadPercentValue = 100 / vm.gaData.minMembers * vm.gaData.stats.activeMembers;
            } else {
                vm.loadPercentValue = 100;
            }
        } 

        // Данные для треугольника с уровнем
        function getMyStatsRating() {
            vm.ratingTable = vm.gaData.stats.spreading;
            vm.myLuck = vm.myStatus.luck;
            if (vm.myStatus.status !== 'ACTIVE') {
                vm.ratingValue = 1;
                vm.zeroRatingValue = 2;
                vm.ratingTableTooltip = 'Ты еще не вступил в розыгрыш? Скорее принимай участие в розыгрыше и увеличивай свои шансы на выигрыш!';
            } else {
                if (vm.myLuck !== 0) {
                    var key = 0;
                    var max = 0;
                    for (var i in vm.ratingTable) {
                        if (max <= i) {
                            max = i;
                        }
                        key++;
                        if (vm.myLuck >= i) {
                            vm.currentRatingPosition = vm.ratingTable[i];
                        }
                    }
                    var zeroCheck = vm.currentRatingPosition == 0 ? 1 : vm.currentRatingPosition;
                    vm.ratingTableTooltip = 'Ты на верном пути! Твой LUCK больше, чем у '+ zeroCheck + '% участников! Так держать! Посмотри, что еще можно сделать, чтобы повысить шансы на победу?';
                    if (vm.currentRatingPosition <= (vm.ratingTable[max]/5)) {
                        vm.ratingValue = 1;
                    } else if (vm.currentRatingPosition > (vm.ratingTable[max]/5) && vm.currentRatingPosition < (vm.ratingTable[max]/5*2)) {
                        vm.ratingValue = 2;
                    } else if (vm.currentRatingPosition > (vm.ratingTable[max]/5*2) && vm.currentRatingPosition < (vm.ratingTable[max]/5*3)) {
                        vm.ratingValue = 3;
                    } else if (vm.currentRatingPosition > (vm.ratingTable[max]/5*3) && vm.currentRatingPosition < (vm.ratingTable[max]/5*4)) {
                        vm.ratingValue = 4;
                    } else if (vm.currentRatingPosition >= (vm.ratingTable[max]/5*4)) {
                        vm.ratingValue = 5;
                        vm.ratingTableTooltip = 'Отлично! Ты в топе участников, у которых огромное количество LUCK! Но не расслабляйся - если остались еще квесты, выполняй их скорей, чтобы продержаться в топе максимально долго.';
                    }
                } else {
                    vm.ratingValue = 1;
                    vm.zeroRatingValue = 1;
                    vm.ratingTableTooltip = 'Поздравляем! Ты вступил в битву за приз! Перед тобой открыты все возможности - выполняй квесты и поднимайся вверх! Каждый заработанный LUCK повышает твои шансы на победу!';
                }
                /**
                 * Проверка того, сколько я получил лака за подписку на канал twitch, если я старый подписчик
                 */
                vm.myStatus.tasks.forEach(function(f){
                    if (f.params.oldFollower != undefined) {
                        vm.gaData.tasks.forEach(function(a){
                            if (a.id == f.id && a.taskType == f.taskType) {
                                a.newLuck = f.luck;
                            }
                        })
                    }

                })

            }
        }


        /**
         * Проверка ЦД на неверный ответ на квест "CODE"
         */
        function myStatusCodeError() {
            vm.myStatusCodeBlock = [];
            if (vm.myStatus) {
                vm.myStatus.tasks.forEach(function(f){
                    if (f.taskType == 'CODE' && f.luck == 0) {
                        vm.myStatusCodeBlock.push(f.id);
                    }
                });
            }
        }

        /**
         * Проверка ЦД на неверный ответ на квест "IMAGE-CODE"
         */
        function myStatusImageCodeError(id) {
            var error = false;
            if (vm.myStatus) {
                vm.myStatus.tasks.forEach(function(f){
                    if (f.taskType == 'IMAGE_CODE' && f.luck == 0 && f.id == id) {
                        error = true;
                    }
                });
                if (error) return true;
            }
        }

        /**
         * Открытие модального окна для выбора верного ответа из нескольких картинок для ЦД "IMAGE_CODE"
         */
        function openImageCodeModal(row,key){
            $rootScope.codeImageModal = {row: row, key:key};
            modalService.openModal('codeImage', {row: row, key:key}, 'lg', 'code-image','codeImageModalController');
        }

        /**
         * Обработка данных из модалки выбора ответа по картинкам
         * @param data - огромный массив данных
         * {task: row - весь объект таска
         * key: vm.items.key - порядок в списке ЦД в розыгрыше
         * id: id - CODE - номер выбранного ответа
         * }
         */
        function getResponseFromImageCodeModal(data){
            vm.waiter[data.key] = false;
            sentRespFromSocial(
                data.task.taskType,
                {
                    id: data.task.id,
                    taskType:data.task.taskType,
                    code: data.id
                },
                data.task.luck,
                data.key
            );
        }

        /**
         * Открытие модального окна для загрузки изображения для ЦД "UPLOAD"
         */
        function openUploadImageFromModal(row,key){
            $rootScope.uploadImageFromModal = {row: row, key:key};
            console.log('$rootScope.uploadImageFromModal',$rootScope.uploadImageFromModal);
            modalService.openModal('uploadImage', {}, 'md', 'upload-image');
        }

        /**
         * Обработка данных из модалки выбора ответа по картинкам
         * @param data - огромный массив данных
         * {
         * task: row - весь объект таска
         * key: vm.items.key - порядок в списке ЦД в розыгрыше
         * url: @string - URL загруженной картинки
         * }
         */
        function completeUploadImageFromModal(data){
            $rootScope.uploadImageFromModal = undefined;
            vm.waiter[data.key] = false;
            sentRespFromSocial(
                data.task.taskType,
                {
                    id: data.task.id,
                    taskType: data.task.taskType,
                    url: data.url
                },
                data.task.luck,
                data.key
            );
        }

        /**
         * Определение состояния выполнения ЦД "UPLOAD"
         * @param row
         * @returns {boolean}
         */
        function cdUploadWaitModeration(row){
            var error = false;
            if (vm.myStatus) {
                vm.myStatus.tasks.forEach(function(f){
                    if (f.taskType == 'UPLOAD' && f.luck == 0 && f.id == row.id) {
                        error = true;
                    } else if (f.taskType == 'UPLOAD' && f.luck != 0 && f.id == row.id) {
                        error = true;
                        vm.gaData.tasks.forEach(function(a){
                            if (a.taskType == f.taskType && a.id == f.id) {
                                a.newLuck = f.luck;
                            }
                        })
                    }
                });
                if (error) return true;
            }

        }

        //Получение моего статуса в розыгрыше
        function checkMyStatus() {
            preloader.act('raffleController-checkMyStatus');
            var getUrl = 'api/raffle/' + vm.gaData.id + '/me';
            $http.get(getUrl)
                .then(function(response){
                    vm.myStatus = response.data.data; //TODO
                    autoJoin(); // Попытка автовхода в розыгрыш
                    preloader.dis('raffleController-checkMyStatus');
                })
                .then(getMyStatsRating)
                .then(getLocalStorageModalKey) //Получения ключа для отображения модального окна с инструкцией по розыгрышу
                .then(replaceBannersLinks)
                .then(myStatusCodeError)
                .catch(function (response) {
                    console.log('Ошибка получения данных о статусе');
                    preloader.dis('raffleController-checkMyStatus');
                    vm.ratingValue = 1;
                    vm.zeroRatingValue = 2;
                    vm.ratingTableTooltip = 'Ты еще не вступил в розыгрыш? Скорее принимай участие в розыгрыше и увеличивай свои шансы на выигрыш!';
                });
        }

        // Сохранение изменений
        function saveChanges() {
            var postUrl = 'api/raffle/' + vm.gaData.id + '/update';
            var parts = vm.configName.split('#');
            vm.myTasksList.forEach(function(f){
                if (f.id !== '') {
                    if (f.luck > 20) f.luck = 15
                } else {
                    vm.postSaveSettingsError = true;
                }

            });

            if (vm.postSaveSettingsError == false) {
                preloader.act('raffleController-saveChanges');
                var data = {
                    playDate: vm.gaDate,
                    name: parts[1],
                    tasks: vm.myTasksList
                };
                $http.post(postUrl, data)
                    .then(function(response){
                        checkGiveAway();
                        preloader.dis('raffleController-saveChanges');
                    })
                    .catch(function (response) {
                        preloader.dis('raffleController-saveChanges', response.data);
                    });
            }
        }

        // Получение списка возможных ЦД для создания стримером
        function getStreamersCanCreateTasks() {
            if ($rootScope.user ) {
                    if ($rootScope.user.userData.role === 'ADMIN' || $rootScope.user.userData.role === 'STREAMER') {
                        $http.get('/api/raffle/tasks/streamer')
                            .then(function(response){
                                vm.streamersCanCreateTasks = response.data.data;
                            })
                    }
                }
        }

        // Получение списка созданных мною тасков
        function getMyTasksList() {
            vm.myTasksCounter = 0;
            if (vm.gaData) {
                var a = JSON.parse( JSON.stringify( vm.gaData.tasks ) );
                a.forEach(function(f){
                    //f = JSON.parse(JSON.stringify(a));
                    if (f.owner == 'STREAMER') {
                        vm.myTasksList.push(f);
                        vm.myTasksCounter++;
                    }
                    if (f.taskType === 'WELCOME_VIDEO') {
                        vm.helloBannerData = f;
                    }
                    if (f.params) {
                        // Херня для новогоднего эксперимента. Выпилить потом нахуй
                        if (f.params.level == 1) {
                            if (f.taskType == 'SHARE_VK') {
                                vm.questLevelSecond1 = f;
                            } else if (f.taskType == 'VIDEO') {
                                vm.questLevel1 = f;
                            }
                        } else if (f.params.level == 2 ) {
                            if (f.taskType == 'FOLLOW_TWITCH') {
                                vm.questLevelSecond2 = f;
                            } else if (f.taskType == 'VIDEO') {
                                vm.questLevel2 = f;
                            }
                        } else if (f.params.level == 3 ) {
                            if (f.taskType == 'SUBSCRIBE_VK' && f.id == 'streampubnet') {
                                vm.questLevelSecond3 = f;
                            } else if (f.taskType == 'VIDEO') {
                                vm.questLevel3 = f;
                            }

                        }
                    }
                    if (f.taskType == 'VIDEO_VOTE') {
                        vm.videoVoteData = f;
                    }
                })
            }
        }
        
        function questNextStep(task, type) {
            console.log('task',task, 'type', type);
            if (vm.questCurrentLevel == 1) {
                if (type == 'FIRST') {
                    vm.showVideoIframe = true;
                    simplePlayHelloVideo(task);
                } else {
                    vm.postSocial('SHARE_VK','', task.luck);
                }
            } else if (vm.questCurrentLevel == 2) {
                if (type == 'FIRST') {
                    vm.showVideoIframe = true;
                    simplePlayHelloVideo(task);
                } else {
                    vm.postSocial('FOLLOW_TWITCH', task.id, task.luck)
                }
            } else if (vm.questCurrentLevel == 3) {
                if (type == 'FIRST') {
                    vm.showVideoIframe = true;
                    simplePlayHelloVideo(task);
                } else {
                    vm.postSocial('SUBSCRIBE_VK', task.id, task.luck)
                }
            }
            vm.switchShowChance();
        }

        //Проверка увеличения лака
        function lentaChance (newLuck, oldLuck) {
            var result;
        if (oldLuck / newLuck > 1) {
            result = Math.round((100 / oldLuck) * newLuck);
            if (result < 0 ) result = result * (-1);
            return result  + '%';
        } else {
            var prefix = 'раз';
            var sample = '' + Math.round(newLuck / oldLuck);
            var index = sample.charAt(sample.length-1);
            result = Math.round(newLuck / oldLuck);
            if ((index == 2 || index == 3 || index == 4) && (result != 12 && result != 13 && result != 14)) {
                prefix = 'раза';
            }
            if (result < 0 ) result = result * (-1);
            if (result == 1 ) result = 2;
            return result + ' ' + prefix;
        }
    }


        //Проверка увеличения лака - проверка префикса
        function lentaChancePrefix (newLuck, oldLuck) {
            if (oldLuck / newLuck > 1) {
                return 'на ';
            } else {
                return 'в ';
            }
        }

        // Открытие модального окна с предупреждением о долгом начислении лака
        function openSlowBalanceModal() {
            console.log('открываю модалку');
            modalService.openModal('slowBalance', {}, 'md', 'slowbalance');
        }

        // добавление в список тасков для кампании
        function addToActionsList() {
            var sampleObj = {
                taskType: vm.selectTargetAction,
                id: null,
                name: null,
                luck: 1,
                owner: 'STREAMER'
            };
            vm.myTasksCounter++;
            vm.myTasksList.push(sampleObj);
        }

        // Удаление элемента из списка тасков
        function deleteFromTargetList(key) {
            vm.myTasksCounter--;
            vm.myTasksList.splice(key,1);
        }

        // Выбрать другой товар
        function selectAnyItem() {
            if (vm.gaData) {
                preloader.act('raffleController-selectAnyItem');
                var postUrl = 'api/raffle/' + vm.gaData.id + '/cancel';
                var data = {};
                $http.post(postUrl, data)
                    .then(function(){
                        vm.gaData =  undefined;
                        preloader.dis('raffleController-selectAnyItem');
                        $location.url('/wizard');
                    })
                    .catch(function (response) {
                        preloader.dis('raffleController-selectAnyItem',response.data);
                    });
            }
        }

        // Принять участие в розыгрыше
        function joinRaffle() {
            if ($rootScope.user) {
                preloader.act('raffleController-joinRaffle');
                var postUrl = 'api/raffle/' + vm.gaData.id + '/join';
                var data = {};
                $http.post(postUrl, data)
                    .then(function(response) {
                        console.log('post-raffle-join: ', response);
                        preloader.dis('raffleController-joinRaffle');
                    })
                    .then(function() {
                        raffleReload();
                        openHelloBanner();
                    })
                    .then(getMyStatsRating)
                    .catch(function (response) {
                        preloader.dis('raffleController-joinRaffle',response.data);
                    });
            } else {
                sessionStorage.setItem('autoJoin', true);
                login();
            }
        }

        function openHelloBanner() {
            modalService.openModal('raffleHelloBanner', {
                giftName: vm.gaData.activeGift.gift.name,
                sponsorName: vm.gaData.activeGift.gift.campaign.sponsor.name,
                background: vm.modalBg,
                task: vm.helloBannerData ? vm.helloBannerData : undefined
            }, 'lg', 'hellowbanner','',{class: 'helloBanner-modal'});
        }

        function raffleReload() {
            checkUsers();
            checkGiveAway();
            checkMyStatus();
        }

        // Определить победителя
        function rollRaffle(type) {
            var data = {
                id: vm.gaData.id,
                test: false,
                max: vm.gaData.stats.summLuck,
                type: type
            };
            intercomService.emit('raffleStart', data);
        }

        // Определение URL для стрима и чата
        /*function getStreamUrls() {
            //Определение URL стрима
            vm.streamUrl = 'https://player.twitch.tv/?channel=' + vm.gaData.organizer.name;
            vm.stream = $sce.trustAsResourceUrl(vm.streamUrl);

            //Определение URL чата
            vm.streamChatUrl = 'https://www.twitch.tv/' + vm.gaData.organizer.name.toLowerCase() + '/chat?popout=';
            vm.streamChat = $sce.trustAsResourceUrl(vm.streamChatUrl);
        }*/

        // Изменение своего #
        function changeConfigName() {
            if (vm.configName.length <= vm.gaData.activeGift.gift.name.length) {
                vm.configName = vm.gaData.activeGift.gift.name + ' #';
            }
        }

        // Логин через твитч
        function login() {
            modalService.openModal('popupLogin', '', 'md', 'popuplogin');
        }

        /**
         * Отчет о шаринге в соц.сети
         * @param social - тип ЦД, по которому нужно отправить отчет
         * @param id - идентификатор таска в розыгрыше
         * @param luck - количество начисляемого лака за выполненное действие
         * @param data - специфическая инфа для ЦД
         */
        function postSocial(social, id, luck, data) {
            vm.postSocialData = {
                id: id,
                luck: luck,
                data: data
            };
            if (social === 'SHARE_FB') {
                if (vm.config.debug) {
                    FB.init({
                        appId      : '291413754554799', // Тестовый
                        status     : true,
                        cookie     : true,
                        xfbml      : true,
                        version    : 'v2.7'
                    });
                } else {
                    FB.init({
                        appId      : '1770916429852830',
                        status     : true,
                        cookie     : true,
                        xfbml      : true,
                        version    : 'v2.7'
                    });
                }
                FB.ui(
                    {
                        method: 'feed',
                        name: vm.gaData.activeGift.gift.name + ' #' + vm.gaData.name,
                        picture: 'http://streampub.net' + vm.gaData.activeGift.gift.images[0].imageLink,
                        description: "Успей на розыгрыш от " + vm.gaData.name + " и "+ vm.gaData.activeGift.gift.campaign.sponsor.name +". Выиграй "+ vm.gaData.activeGift.gift.name +" ! Победитель будет определен на стриме https://www.twitch.tv/" + vm.gaData.organizer.name + " . Регистрация - по ссылке ниже.",
                        link: window.location.href
                    },
                    function(response) {
                        if (response && response.post_id) {
                            var getUrl = 'api/raffle/' + vm.gaData.id + '/' + social;
                            $http.post(getUrl,{post_id:response.post_id})
                                .then(function(){
                                    vm.myStatus.luck = vm.myStatus.luck + luck;
                                    var newData = {
                                        name: 'SHARE_FB',
                                        status: true
                                    };
                                    vm.checkStatus.push(newData);
                                })
                                .catch(function(response){
                                    preloader.dis('raffleController-checkUsers',response.data);
                                });
                        } else {
                            console.log('Ошибка FB.share');
                        }
                    }
                );
            } else if (social === 'SHARE_VK') {
                shareVK(social, luck);
            } else if (social === 'FOLLOW_TWITCH' || social === 'SUBSCRIBE_TWITCH') {
                sentRespFromSocial(social,{id:id}, luck);
            } else if (social === 'DIRECT_LINK') {
                sentRespFromSocial(social,{id:id}, luck);
            } else if (social === 'SUBSCRIBE_FB') {
                sentRespFromSocial(social,{id:id}, luck);
            } else if (social === 'SUBSCRIBE_VK') {
                sentRespFromSocial(social,{id:id}, luck);
            } else if (social === 'LIKE_VK') {
                sentRespFromSocial(social,{id:id}, luck);
            } else if (social === 'REPOST_VK') {
                sentRespFromSocial(social,{id:id}, luck);
            } else if (social === 'COMEBACK') {
                sentRespFromSocial(social,{id:id}, luck);
            } else if (social === 'CPA') {
                sentRespFromSocial(social,{id:id}, luck,data);
            } else if (social === 'VIDEO_VOTE') {
                sentRespFromSocial(social,{id:id, video:data}, luck);
            } else if (social === 'WELCOME_VIDEO') {
                sentRespFromSocial(social,{id:id}, luck);
            } else if (social == 'GLOBAL') {
                sentRespFromSocial(social,{id:id, luck:luck},luck);
            }
        }

        /**
         * Шаринг в ВК
         * @param social - передача имени соц.сети
         * @param luck - количество лака за выполнение ЦД
         */
        function shareVK(social, luck) {
            VK.Auth.getLoginStatus(function (response) {
                if (response.session) {
                    /* Авторизованный в Open API пользователь, response.status="connected" */
                    postVk(response.session.mid, social, luck);
                } else {
//                console.log(response);
                    VK.Auth.login(function (resp) {
                        if (resp.session) {
                            /* Пользователь успешно авторизовался */
                            //                console.log(response);
                            postVk(resp.session.user.id, social, luck);
                        } else {
                            console.log("Not autorize", response);
                            /* Пользователь нажал кнопку Отмена в окне авторизации */
                        }
                    }, 1); //270336

                    /* Неавторизованный в Open API пользователь,  response.status="not_authorized" */
                }
            });
        }

        // проверка подписки на группу ВК
        function subscribeVK(social,group_id,groupName, luck) {
            VK.Auth.getLoginStatus(function (response) {
                if (response.session) {
                    sentRespFromSocial(social,{uid:response.session.mid,id:group_id,name:groupName}, luck);
                } else {
                    VK.Auth.login(function (resp) {
                        if (resp.session) {
                            sentRespFromSocial(social,{uid:resp.session.user.id,groupId:group_id,name:groupName}, luck);
                        } else {
                            console.log("Not autorize", response);
                        }
                    }, 1); //270336
                }
            });
        }

        // Проверка лайка в FB
        function likeFb(social,group_id,groupName, luck) {
            FB.init({
                appId      : '1770916429852830',
                //appId      : '291413754554799', // тестовый
                status     : true,
                cookie     : true,
                xfbml      : true,
                version    : 'v2.7'
            });
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    var user_id = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;
                    sentRespFromSocial(social,{uid:user_id,access_token:accessToken,id:group_id}, luck);
                }
                else {
                    FB.login(function (response) {
                        // console.log(response);
                        if (response.authResponse) {
                            var user_id = response.authResponse.userID;
                            var accessToken = response.authResponse.accessToken;
                            sentRespFromSocial(social,{uid:user_id,access_token:accessToken,id:group_id}, luck);
                        } else {
                            console.log('User cancelled login or did not fully authorize.');
                        }
                    }, {scope: 'email,user_posts,user_likes, public_profile'});
                }
            });
        }

        function authVk(id, type) {
            var unlogin = false;
            if ($rootScope.user) {
                $rootScope.user.userData.providers.forEach(function(f){
                    if (f == 'VK') {
                        unlogin = true;
                    }
                })
            }
            
            if (unlogin) {
                $cookies.put('cd_in_process_id', JSON.stringify(id));
                $cookies.put('cd_in_process_type', JSON.stringify(type));
                authenticationService.externalLogin('vk', window.location.pathname);
            }
        }

        function findAutoCheckCdready(){
            var id = $cookies.get('cd_in_process_id');
            var type = $cookies.get('cd_in_process_type');
            if (id && type) {
                for (var item in vm.gaData.tasks) {
                    if (JSON.stringify(vm.gaData.tasks[item].id) === id && JSON.stringify(vm.gaData.tasks[item].taskType) === type) {
                        vm.waiter[item] = true;
                        $cookies.remove('cd_in_process_id');
                        $cookies.remove('cd_in_process_type');
                    }
                }
            }
        }

        // Пост Вконтакте
        function postVk(user_id,social, luck) {
            VK.Api.call('wall.post', {
                message: 'Участвую в розыгрыше на StreamPub - Надеюсь повезёт!',
                attachments: "http://streampub.net/" + vm.gaData.shortLink
            }, function (response) {
                if (response && response.response && response.response.post_id) {
                    console.log("Posted with id ", response.response.post_id); // это id свежесозданного поста
                    sentRespFromSocial(social,{uid:user_id,post_id:response.response.post_id}, luck);
                } else {
                    console.log("Not posted. Error:", response.error);
                }
            });
        }

        // Подключение нового аккаунта
        function connectAccount(provider) {
            var goto = '/' + vm.gaData.shortLink;
            authenticationService.externalLogin(provider, goto);
        }

        function helpModal(social) {
            if (social == 'vk') {
                modalService.openModal('helpmodalvk','','md','helpmodalvk')
            } else if (social == 'facebook') {
                modalService.openModal('helpmodalfacebook','','md','helpmodalfacebook')
            } else if (social == 'twitter') {
                modalService.openModal('helpmodaltwitter','','md','helpmodaltwitter')
            } else if (social == 'instagram') {
                modalService.openModal('helpmodalinstagram','','md','helpmodalinstagram')
            }
        }

        // Ответ о удачном целевом действии
        function sentRespFromSocial(social,data,luck, key) {
            console.log('отправляю запрос',social,data,luck);
            var getUrl = 'api/raffle/' + vm.gaData.id + '/' + social;
            $http.post(getUrl, data)
                .then(function(response) {
                    var statusError = false;
                    var doNotShowAgain = localStorage.getItem('doNotShowTagWindow');
                    if (doNotShowAgain != 'true') {
                        if (social == 'TAG_VK' || social == 'TAG_FACEBOOK' || social == 'TAG_INSTAGRAM' || social == 'TAG_TWITTER') {
                            modalService.openModal('headmoderation','','md','headmoderation');
                        }
                    }
                    if (social != 'WELCOME_VIDEO') {
                        if (vm.questCurrentLevel == 3) {
                            localStorage.setItem('quest-' + vm.gaData.shortLink, true);
                        }
                        vm.questCurrentLevel++;
                    }
                    /**
                     * Начисление вдвое большего лака за старенького подписчика
                     */
                    if (social === 'FOLLOW_TWITCH') {
                        vm.gaData.tasks.forEach(function(f){
                            if (f.id == vm.postSocialData.id && response.data.data.params.oldFollower != undefined) {
                                f.newLuck = response.data.data.luck;
                            }
                        })
                    }
                    if (social == 'VIDEO') {
                        if (vm.videoDisableAfterPost) {
                            vm.gaData.tasks[vm.videoDisableAfterPost].disable = true;
                            vm.videoDisableAfterPost = undefined;
                        }
                    }
                    if (social === 'GLOBAL') {
                        $rootScope.user.userData.luck = $rootScope.user.userData.luck - luck;
                        vm.globalLuckWait = false;
                        intercomService.emit('global-luck-spend',{luck: luck})
                    }
                    if ((social == 'CODE' || social == 'IMAGE_CODE') && response.data.data.luck == 0) {
                        vm.responseError[key] = true;
                        vm.waiter[key] = false;
                        vm.myCodeAnswer[key] = undefined;
                        statusError = true; //не начислять лак
                    }
                    if (social == 'IMAGE_CODE') {
                        $rootScope.codeImageModal = undefined;
                    }
                    if (social == 'UPLOAD' && response.data.data.luck === 0) {
                        console.log('ошибка',response);
                        vm.responseUploadWaitModeration[key] = true;
                        statusError = true; //не начислять лак

                        console.log('vm.responseUploadWaitModeration[key]',vm.responseUploadWaitModeration[key],'statusError',statusError);
                    }

                    console.log('statusError',statusError);
                    if (!statusError) {
                        vm.myStatus.luck = vm.myStatus.luck + luck;
                        var newStatus = {
                            name: social,
                            id:  data.id ? data.id : null,
                            status: true
                        };
                        vm.checkStatus.push(newStatus);
                        console.log('Добавил лака:', luck);
                    } else {
                        console.log('Не добавил лака',social);
                    }
                })
                .catch(function (response) {
                    if (social == 'CPA') {
                        $rootScope.cpaUrlForModal = key;
                        modalService.openModal('cpacdnoncomplete', '', 'md', 'cpacdnoncomplete');
                    } else if (social == 'TAG_VK' || social == 'TAG_FACEBOOK' || social == 'TAG_INSTAGRAM' || social == 'TAG_TWITTER') {
                        if (response.data.error.type == 'TaskNotCompleteException') {
                            modalService.openModal('splaterror', '', 'md', 'splaterror');
                        } else if (response.data.error.type == 'WrongLinkException'){
                            modalService.openModal('splaterrorlink', {
                                social: social
                            }, 'md', 'splaterrorlink','');
                        } else if (response.data.error.type == 'LinkAlreadyUsedException'){
                            modalService.openModal('splatlinkexception', '', 'md', 'splatlinkexception');
                        } else if (response.data.error.type == 'AlreadyDoneTaskException'){
                            modalService.openModal('default', {
                                head: 'Ошибка!',
                                text: 'Этот квест уже выполнен тобой!'
                            }, 'md', 'default');
                        }
                    } else if (social == 'CODE') {
                        modalService.openModal('default', {
                            head: 'Ошибка!',
                            text: 'Ты неправильно ответил на заданный вопрос! Попробуй еще!'
                        }, 'md', 'default');
                    } else if (response.data.error.type == 'RestrictionTaskException') {
                        modalService.openModal('default', {
                            head: 'Есть ограничение',
                            text: 'Ты можешь выполнять этот квест не более 30 раз. Далее LUCK начисляться не будет(('
                        }, 'md', 'default');
                    }
                    preloader.dis('raffleController-checkUsers', response.data);
                });
        }

        // openGraph метки для каждого розыгрыша
        function individualOg() {
            $rootScope.ogTitle = vm.gaData.activeGift.gift.name + ' - ' + vm.gaData.name;
            $rootScope.ogImage = 'http://streampub.net' + vm.gaData.activeGift.gift.images[0].imageLink;
            $rootScope.ogDesc = "Успей на розыгрыш от " + vm.gaData.name + " и " + vm.gaData.activeGift.gift.campaign.sponsor.name +". Выиграй "+vm.gaData.activeGift.gift.name +"! Победитель будет определен на стриме https://www.twitch.tv/" + vm.gaData.organizer.name + " . Регистрация - по ссылке ниже.";
            $rootScope.ogLink  = window.location.href;
        }

        function checkGlobalLuckCounter(data) {
            $rootScope.user.userData.luck = $rootScope.user.userData.luck + data.luck;
            if ($rootScope.user.userData.luck != 0) {
                vm.globalLuckWait = true;
                vm.globalLuckDisable = false;
            } else {
                vm.globalLuckDisable = true;
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

        // Окончание загрузки стрима с Twitch.tv
        /*function endLoadStream() {
            preloader.dis('raffleController-endLoadStream');
        }*/

        // Окончание загрузки чата с Twitch.tv
        /*function endLoadChat() {
            preloader.dis('raffleController-endLoadChat');
        }*/


        /**
         * Автообновление количества участников в розыгрыше.
         * @config interval - частота запросов в секундах
         */
        function getUserCount() {
            /*var interval = 10;
            var getUrl = '/api/raffle/' + vm.gaData.id + '/member-count';
            setInterval(function(){
                $http.get(getUrl)
                    .then(function(response){
                        vm.config.debug ? console.log('Обновил кол-во участников:', vm.gaData.stats.activeMembers, '->', response.data.data) : null;
                        vm.gaData.stats.activeMembers = response.data.data;
                    })
            }, interval*1000);*/
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
                }
            }
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

        /**
         * Конвертер секунд в юзабильный вид
         * @param sec - длительность видео в секундах, получаемого из плеера YouTube
         * @returns {string} - возвращает оставшееся время воспроизведения, в формате "XX:XX сек"
         */
        function secToTime(sec) {
            var dt = new Date();
            dt.setTime(sec*1000);
            return dt.getUTCHours()+":"+dt.getUTCMinutes()+":"+dt.getUTCSeconds();
        }

        function playVideoFromHellowBanner() {
            /**
             * 0 - просмотр видео отменен пользователем
             * 1 - начальная установка
             * 2 - полностью окончил просмотр видео
             */
            vm.videoFromHelloBanner = 1;
            vm.showVideoIframe = true;
            simplePlayHelloVideo(vm.helloBannerData);
        }

        /*************************  Простой YouTube-плеер для одного видео ************************/
        function simplePlayHelloVideo(row) {
            var luck = row.luck, videoId = row.id;
            vm.player =  undefined;
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

        /*************************  Простой YouTube-плеер для произвольного видео************************/
        function simpleYouTubePlayer(row) {
            var videoId = row.id;
            vm.player =  undefined;
            vm.videoId = videoId;
            vm.showVideoIframe = true;
            vm.player = new YT.Player('player', {
                videoId: videoId ? videoId : 'vsfSwztvV9o',
                playerVars: {
                    autoplay: 0
                }
            });
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
            } else if (row.taskType == 'WELCOME_VIDEO') {
                vm.videoFromHelloBanner = 1;
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
         * Получение длительности видео при его загрузке
         * @param event - событие из YouTube-плеера
         */
        function videoTimerCounter(event) {
            vm.videoDuration = event.target.getDuration();
        }

        /**
         * Запуск таймера видео. Вызывается при изменении статуса YouTube-плеера на 3
         */
        function startTimer() {
            vm.videoInterval = setInterval(function(){
                vm.videoDuration--;
                if(vm.videoDuration == 0) {
                    //endShowVideo();
                    clearInterval(vm.videoInterval);
                }
            }, 1000)
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
            if (vm.videoFromHelloBanner == 1) {
                modalService.openModal('closehellovideo', {}, 'md', 'closehellovideo');
                vm.videoFromHelloBanner = 0;
            } else if (vm.videoFromHelloBanner == 2) {
                vm.videoFromHelloBanner = 0;
            }
        }

        /**
         * Остановка воспроизведения видео путем окончания таймера продолжительности видео
         */
        function endShowVideo() {
            vm.youtubeOk = false;
            vm.showVideoIframe = false;
            vm.videoDuration = 0;
            if (vm.videoFromHelloBanner == 1) {
                sentRespFromSocial('WELCOME_VIDEO',{id: vm.videoId}, vm.youtubeLuck);
            } else {
                if (vm.player) {
                    sentRespFromSocial('VIDEO',{id: vm.videoId}, vm.youtubeLuck);
                } else if (vm.randomPlayer) {
                    sentRespFromSocial('VIDEO_CAROUSEL',{id: vm.RandomVideoId, video: vm.videoId}, vm.youtubeLuck);
                }
            }
            if (vm.player) {
                vm.player.destroy();
                vm.player = undefined;
            } else if (vm.randomPlayer) {
                vm.randomPlayer.destroy();
                vm.randomPlayer = undefined;
            }
            vm.videoFromHelloBanner = 2;
            clearInterval(vm.videoInterval);

            // Повышение кол-ва просмтров видосов
            var videoShowedId = localStorage.getItem(vm.videoId) + 1;
            localStorage.setItem(vm.videoId, videoShowedId);
            localStorage.setItem(vm.videoId + '_date', new Date());

            config.debug ? console.log('завершил просмотр') : null;
        }

        /********************** КАРУСЕЛЬ ВИДЕО - START **********************/
        // Получение случаного числа
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        /**
         * Выбор случайного видео из массива видосов из целевого действия
         * @param row - целый объект целевого действия
         */
        function findRandomVideo(row) {
            console.log('findRandomVideo');
            vm.youtubeLuck = row.luck;
            vm.RandomVideoId = row.id;
            vm.playRandomVideoError = false;
            vm.randomCarouselData = getRandomInt(0, row.params.list.length);
            if (vm.carouselArray.length === row.params.list.length) {
                vm.carouselArray = [];
            }
            vm.carouselArray.forEach(function(f){
                if (f === row.params.list[vm.randomCarouselData]) {
                    vm.playRandomVideoError = true;
                }
            });
            if (!vm.playRandomVideoError) {
                vm.carouselArray.push(row.params.list[vm.randomCarouselData]);
                console.log('vm.carouselArray',vm.carouselArray);
                console.log('list[vm.randomCarouselData]',row.params.list[vm.randomCarouselData]);
                playRandomVideo(row.params.list[vm.randomCarouselData]);
            } else {
                vm.playRandomVideoError = false;
                findRandomVideo(row);
            }
        }

        /**
         * Воспроизведение рандомного видео
         * @param videoId - ID видео из целевого действия
         */
        function playRandomVideo(videoId) {
            console.log('начал воспроизведение карусели');
            vm.randomPlayer = undefined;
            vm.videoId = undefined;
            vm.videoId = videoId;
            vm.randomPlayer = new YT.Player('player', {
                videoId: videoId,
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
                    'onReady': videoTimerCounterCarousel,
                    'onStateChange': checkEndStatusCarousel
                }
            });

        }

        // Окончание просмотра видео
        function checkEndStatusCarousel(event) {
            console.log('Проверка статуса карусели');
            if (event.target.getPlayerState() == 0){
                event.target.stopVideo();
                console.log('Карусель остановлена');
                endShowVideoCarousel();
            } else if (event.target.getPlayerState() == 2){
                event.target.playVideo();
            } else if (event.target.getPlayerState() == 3){
                startTimer();
            }
        }

        // Счетчик времени видео
        function videoTimerCounterCarousel(event) {
            vm.videoDuration = event.target.getDuration();
        }

        // Остановка воспроизведения
        function endShowVideoCarousel() {
            console.log('сценарий завершения просмотра карусели');
            vm.youtubeOk = false;
            vm.randomPlayer.destroy();
            vm.randomPlayer = undefined;
            vm.videoDuration = 0;
            vm.showVideoIframe = false;
            clearInterval(vm.videoInterval);
            sentRespFromSocial('VIDEO_CAROUSEL',{id: vm.RandomVideoId, video: vm.videoId}, vm.youtubeLuck);
            config.debug ? console.log('завершил просмотр') : null;
        }

        /********************** КАРУСЕЛЬ ВИДЕО - END **********************/

        // Запрос ссылки, которой можно поделиться с друщьями
        function getVideoLink(videoId, luck, count) {
            var videoUrl = {
                url: 'https://' + window.location.host + '/' + 'video/' + vm.gaId + '/' + vm.myStatus.id + '/' + videoId,
                luck: luck,
                count: count
            };
            modalService.openModal('showVideoLink', videoUrl, 'md', 'showvideolink');
        }

        // События нажатия зеленой кнопки
        function switchShowChance() {
            vm.showChance = !vm.showChance;
            if (localStorage.getItem('quest-' + vm.gaData.shortLink)){
                vm.questStatus = localStorage.getItem('quest-' + vm.gaData.shortLink);
            }
            if (vm.showChance) {
                $rootScope.trackClick('gbutton',vm.gaData.shortLink);
                var postUrl = '/api/raffle/' + vm.gaData.id + '/log';
                $http.post(postUrl, {});
                
                //Получение прав на уведомления
                /*Notification.requestPermission(function(permission){
                    console.log('Результат запроса прав:', permission);
                });*/
            }
        }

        // Получение цифры увеличения шансов на выигрыш при выполнении ЦД
        function showChanceTooltip(luck) {
            var lineEnd, element, percent = (vm.myLuck + luck) / vm.myLuck;
            // Возвращаем проценты
            if (percent < 2) {
                var percentValue = Math.round(100 / vm.myLuck * luck);
                return 'Выполни это задание и увеличь свои шансы на ' + percentValue + '%';
            }
            // Возвращаем разы
            else {
                percent = Math.round(percent);
                percent = percent + '&';
                element = percent.charAt(percent.indexOf("&") - 1);
                if (element == 1 || element == 2 || element == 3 || element == 4) {
                    lineEnd = 'раза';
                } else {
                    lineEnd = 'раз';
                }
                percent = percent.replace("&", "");
                return 'Выполни это задание и увеличь свои шансы в ' + percent + ' ' + lineEnd + '!';
            }
        }

        // Отправка ссылки из соц. сети с хэштэгом на бэк
        function enterSocialLink(taskType, id, luck, key, hashtag) {
            var data = {
                taskType: taskType,
                id:id,
                url: vm.mySocialPostLink[key] || '',
                hashtag: hashtag
            };
            sentRespFromSocial(taskType,data,luck);
        }

        /**
         * Отправка ответа на вопрос из ЦД
         * @param row - весь объект ЦД
         * @param data - объект с ответом, вида {code: XXXXX}
         */
        function enterCodeAnswer(row, data, key) {
            sentRespFromSocial(row.taskType,data,row.luck, key);
        }

        /**
         * Устанока текущего времени в LocalStorage для проверки времени после последнего визита
         * @param link - Короткая ссылка на розыгрыш, из которой формируется имя переменной в локальном хранилище
         */
        function setComebackDate(link) {
            vm.combackTimeId = 'combackTime-' + link;
            if (!localStorage.getItem(vm.combackTimeId)) {
                localStorage.setItem(vm.combackTimeId, new Date());
            }
        }

        /**
         * Открытие окна для входа на сайт
         */
        function enterSite(){
            modalService.openModal('popupLogin', '', 'md', 'popuplogin')
        }

        /**
         * Отправка отчета о выполнении ЦД "COMEABACK"
         * @param row - весь объект целевого действия "COMEBACK"
         */
        function comebackTask(row) {
            postSocial(row.taskType, row.id, row.luck);
            localStorage.setItem(vm.combackTimeId,new Date());
        }

        /**
         * Добавление глобального лака в розыгрыш
         * @param row - весь объект таска
         * @param luck - количество лака из $rootScope.user.userData.luck;
         */
        function pushLuckToraffle(row, luck) {
            postSocial(row.taskType, row.id, luck, {});

        }

        /**
         * Проверка отображения кнопки для выполнения "Возврата на страницу турнира"
         * @param row - весь объект целевого действия "COMEBACK"
         * @returns {boolean} - если возвращает true, то появится возможность выполнить ЦД еще раз и получить лак
         */
        function checkComebackStatus(row) {
            var currentTime = new Date();
            var oldTime = localStorage.getItem(vm.combackTimeId);
            if (oldTime) {
                if (((Date.parse(currentTime) - Date.parse(oldTime)) / 1000) > row.params.interval * 60) {
                    return true;
                }
            }
        }

        function videoVote(row) {
            $rootScope.videoVoteData = row;
            modalService.openModal('videovote', {}, 'lg', 'videovote');
        }

        function showByLevel(row){
            if (row.params) {
                if (row.params.level) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }

        /**
         * Установка переменной в LocalStorage для фильтрации события
         * закрытия блока с поздравлениями при первом розыгрыше.
         * Срабатывает при клике на крестик в приветственном блоке
         */
        function setLocalStorageTag() {
            if ($rootScope.itIsMyFirstRaffle) {
                var paramName = 'tag-' + vm.gaData.shortLink;
                if (!localStorage.getItem(paramName)) {
                    localStorage.setItem(paramName, true);
                }
            }

        }

        /**
         * Получение значения переменной, отвечающей за закрытие / отображение
         * приветственного блока в первом розыгрыше
         * @returns {boolean} - возвращает true, если человек не закрывал руками приветственный блок
         */
        function getLocalStorageTag() {
            if ($rootScope.itIsMyFirstRaffle) {
                var paramName = 'tag-' + vm.gaData.shortLink;
                if (!localStorage.getItem(paramName)) {
                    return true;
                }
            }
        }


        /******************************** Админские фишки ******************************/
        vm.adminOpenHelloModal = adminOpenHelloModal;

        adminActivate();

        function adminActivate() {
            intercomService.on('raffle.open.helloModal', adminOpenHelloModal);
            intercomService.on('raffle.show.youtubeVideo', adminShowYoutube);
        }

        // Открытие модального окна "Hello User"
        function adminOpenHelloModal() {
            modalService.openModal('raffleHelloBanner', {
                giftName: vm.gaData.activeGift.gift.name,
                sponsorName: vm.gaData.activeGift.gift.campaign.sponsor.name,
                background: vm.modalBg,
                task: vm.helloBannerData ? vm.helloBannerData : undefined
            }, 'lg', 'hellowbanner','',{class: 'helloBanner-modal'});
        }

        function adminShowYoutube() {
            vm.showVideoIframe = true;
            vm.onYouTubeIframeAPIReady();
        }
    }
})();