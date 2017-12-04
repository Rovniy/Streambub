(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['$http', 'preloader', '$location', 'config','authenticationService','$rootScope','modalService'];

    function dashboardController($http, preloader, $location, config, authenticationService, $rootScope,modalService) {
        var vm = this;
        vm.nohistory = false;
        vm.noMyHistory = false;
        vm.config = config;
        vm.iHaveActiveRaffle = false;
        vm.closeCdTooltip = 'Проводи больше розыгрышей, чтобы повысить свой уровень и открыть новые целевые действия для себя';

        vm.selectAnyItem = selectAnyItem;
        vm.createFirstRaffle = createFirstRaffle;
        vm.createGiveAway = createGiveAway;
        vm.connectAccount = connectAccount;
        vm.widthdrawalModal = widthdrawalModal;
        vm.saveMyQuest = saveMyQuest;

        activate();

        ////////////////

        function activate() {
            getBudget();
            getMyGain();
            getMyTasksList();
            getReferralLink();
            getMyRaffleHistory();
            getRafflesHistory();
            goToDashboardPart();
            getMyQuests();
        }

        /**
         * Получение доступного бюджета стримера
         */
        function getBudget() {
            preloader.act('dashboard-getBudget');
            $http.get('/api/budget')
                .then(function(response) {
                    vm.budget = response.data.data;
                    preloader.dis('dashboard-getBudget');
                })
                .catch(function(response){
                    preloader.dis('dashboard-getBudget', response.data);
                    //vm.config.debug ? $location.url('/') : null;
                })
        }

        /**
         * Получение истории розыгрышей, которые пользователь заводил
         */
        function  getRafflesHistory() {
            preloader.act('dashboard-getRafflesHistory');
            $http.get('/api/raffles/spent?page=0&limit=100')
                .then(function(response) {
                    vm.history = response.data.data;
                    vm.history.forEach(function(f){
                       if (f.finished == false && f.reject == false) {
                        vm.iHaveActiveRaffle = true;
                       }
                    });
                    preloader.dis('dashboard-getRafflesHistory');
                })
                .catch(function(response){
                    vm.nohistory = true;
                    preloader.dis('dashboard-getRafflesHistory', response.data);
                })
        }

        /**
         * Список розыгрышей в которых пользователь принимал участие
         */
        function getMyRaffleHistory() {
            preloader.act('dashboard-getRafflesHistory');
            $http.get('/api/raffles/my?page=0&limit=100')
                .then(function(response) {
                    vm.myHistory = response.data.data;
                    preloader.dis('dashboard-getRafflesHistory');
                })
                .catch(function(response){
                    vm.noMyHistory = true;
                    preloader.dis('dashboard-getRafflesHistory', response.data);
                })
        }

        /**
         * Отменить розыгрыш и выбрать другой товар
         * @param id - ID розыгрыша
         */
        function selectAnyItem(id) {
            preloader.act('dashboard-selectAnyItem');
            var postUrl = 'api/raffle/' + id + '/cancel';
            var data = {};
            $http.post(postUrl, data)
                .then(function(){
                    preloader.dis('dashboard-selectAnyItem');
                    $location.url('/wizard');
                })
                .catch(function (response) {
                    preloader.dis('dashboard-selectAnyItem', response.data);
                });
        }

        /**
         * Отправка пользователя в визард для создания нового розыгрыша
         */
        function createFirstRaffle() {
            $location.url('/wizard');
        }

        /**
         * Отправка пользователя в визард для создания нового розыгрыша с автоскролом до призов
         */
        function createGiveAway() {
            localStorage.setItem('wizardGotoStep2', true);
            $location.url('/wizard');
        }

        /**
         * Подключение нового аккаунта
         * @param provider - тип подключаемой сосиальной сети
         */
        function connectAccount(provider) {
            if ($rootScope.user.userData.providers.indexOf(provider) == -1) {
                if (provider == 'password') {
                    modalService.openModal('popupRegistration', '', 'md', 'popupregistration')
                } else {
                    authenticationService.externalLogin(provider, '/dashboard')
                }
            }
        }

        /**
         * Получение реферральной ссылки
         */
        function getReferralLink() {
            $http.get('/api/referral')
                .then(function(response){
                    vm.referalLink = 'https://' + response.data.data.referral_url;
                    vm.referralsList = response.data.data.referrers;
                })
        }

        /**
         * Открытие окна вывода средств
         * @param source - желаемый способ вывода средств
         */
        function widthdrawalModal(source) {
            $rootScope.withdrawalSource = source;
            modalService.openModal('dashboard-withdrawal',{source: source},'md','dashboard-withdrawal');
        }

        /**
         * Получение доступных мне для вывода средств
         */
        function getMyGain() {
            $http.get('/api/transaction/gain')
                .then(function(response){
                    vm.withdrawal = response.data.data.value;
                })
        }

        /**
         * Получение списка моих целевых действий, доступных для моих розыгрышей
         */
        function getMyTasksList(){
            $http.get('/api/task/my')
                .then(function(response){
                    vm.tasksLisk = response.data.data;
                    console.log('vm.tasksLisk',vm.tasksLisk);
                })
                .catch(function(error){
                    console.log('error',error.data)
                })
        }

        /**
         * Отслеживание GET-параметров
         */
        function goToDashboardPart() {
            vm.getUrlData = $location.search();
            if (vm.getUrlData.goto) {
                if (vm.getUrlData.goto == 'accounts') {
                    scrollPageTo('#pa-social');
                } else if (vm.getUrlData.goto == 'balance') {
                    scrollPageTo('#pa-social');
                } else if (vm.getUrlData.goto == 'referral') {
                    scrollPageTo('#pa-referral');
                } else if (vm.getUrlData.goto == 'raffles') {
                    scrollPageTo('#pa-my-raffles');
                }
            }
        }

        /**
         * Скролл в нужный блок на сайте
         * @param id - ID блока, к которому нужно скролиться
         */
        function scrollPageTo(id) {
            setTimeout(function(){
                var obj = $(id);
                $('html,body').animate({scrollTop: obj.offset().top }, "slow");
            },400);
        }

        function saveMyQuest(obj){
            var data;
            if (obj.taskType != 'DIRECT_LINK') {
                var substringArray = obj.id.split("/");
                    data = {
                        id: substringArray[substringArray.length-1],
                        name: obj.name,
                        taskType: obj.taskType
                    };
            } else {
                data = {
                        id: obj.id  + '?sub_confirmation=1',
                        name: obj.name,
                        taskType: obj.taskType
                    };
            }
            $http.post('/api/task/add',data)
                .then(getMyQuests)
        }

        function getMyQuests(){
            vm.myQuestsList = {};
            $http.get('/api/task/my')
                .then(function(response){
                    response.data.data.forEach(function(f){
                        if (f.task.taskType == 'FOLLOW_TWITCH') {
                            vm.myQuestsList.FOLLOW_TWITCH = true;
                        } else if (f.task.taskType == 'SUBSCRIBE_VK') {
                            vm.myQuestsList.SUBSCRIBE_VK = true;
                        } else if (f.task.taskType == 'SUBSCRIBE_TWITCH') {
                            vm.myQuestsList.SUBSCRIBE_TWITCH = true;
                        } else if (f.task.taskType == 'DIRECT_LINK') {
                            vm.myQuestsList.DIRECT_LINK = true;
                        }
                    });
                })
        }



    }
})();