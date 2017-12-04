(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('wizardController', wizardController);

    wizardController.$inject = ['$http', 'preloader', '$location', '$rootScope', 'intercomService','modalService'];

    function wizardController($http, preloader, $location, $rootScope, intercomService, modalService) {
        var vm = this;
        vm.sortByCategoryRow = [  // Фильтры для сортировки товаров
            '',
            'ONLINE',
            'ARTICLE'
        ];
        vm.orderData = '-gift.price'; // Сортировка по умолчанию
        vm.sortReverce = false; // Направление сортировки
        vm.sortByCategory = ''; // Дефолтный фильтр
        vm.sortBySemi = '';
        vm.giftMoneyType = 'all';
        vm.sortCategoryBack = {
            name: 'Любая категория',
            id: ''
        };
        vm.sortPaidBack = '';
        vm.giftsUpdate = false;
        vm.step1 = true; //Включение первого экрана
        vm.step2 = false; //Включение второго экрана

        vm.createGiveAway = createGiveAway;
        vm.goToGiveAwayPage = goToGiveAwayPage;
        vm.sortFromBack = sortFromBack;

        activate();

        ////////////////

        function activate() {
            getBudget(); // Получение бюджета стримера
            getCategory(); // Получение категорий призов
            checkLocalStorage(); // Проверка наличия сессионных переменных для автоскролла сразу к призам
        }

        // Проверка наличия сессионных переменных для автоскролла сразу к призам
        function checkLocalStorage() {
            if (localStorage.getItem('wizardGotoStep2')){
                localStorage.removeItem('wizardGotoStep2');
                autoGoToStep2();
            }
        }

        // Получение категорий призов
        function getCategory() {
            $http.get('/api/categories')
                .then(function(response){
                    vm.sortByCategoryRow = response.data.data;
                })
                .then(getGifts)
                .catch(function(){
                    console.log('Ошибка получения списка категорий');
                })
        }

        // Получение бюджета стримера
        function sortFromBack(cat, paid) {
            vm.giftsUpdate = true;
            vm.giftList = [];
            if (cat) {
                vm.sortCategoryBack = cat;
            }
            /**
             * История с платными и бюджетными призами
             */
            /*if (paid) {
                vm.sortPaidBack = paid;
            }
            var getUrl = 'api/gift/list?limit=1000&cat=' + vm.sortCategoryBack.id +'&paid=' + vm.sortPaidBack;*/
            var getUrl = 'api/gift/list?limit=1000&cat=' + vm.sortCategoryBack.id;
            $http.get(getUrl)
                .then(function(response){
                    vm.giftsUpdate = false;
                    vm.giftList = response.data.data;
                    console.log('vm.giftList',vm.giftList.length);
                    preloader.dis('wizardController-getGifts');
                })
                .catch(function(response){
                    preloader.dis('wizardController-getGifts',response.data);
                })
        }

        // Нажатие на кнопку создания розыгрыша
        function createGiveAway() {
            vm.step1 = false;
            vm.step2 = true;
        }

        // Запрос списка гифтов
        function getGifts() {
            preloader.act('wizardController-getGifts');
            $http.get('api/gift/list?limit=1000')
                .then(function(response){
                    vm.giftList = response.data.data;
                    preloader.dis('wizardController-getGifts');
                })
                .catch(function(response){
                    preloader.dis('wizardController-getGifts',response.data);
                })
        }

        // Запрос моего бюджета
        function getBudget() {
            preloader.act('wizardController-getBudget');
            $http.get('/api/budget')
                .then(function(response){
                    vm.budget = response.data.data;
                    console.log(vm.budget);
                    preloader.dis('wizardController-getBudget');
                    console.log('response',response);
                    if (!vm.budget) {
                        if ($rootScope.user.userData.role !== 'ADMIN') {
                            modalService.openModal('smallSubscribers', {}, 'md', 'smallsubscribers');
                            $location.url('/');
                        } else {
                            modalService.openModal('smallSubscribers', {}, 'md', 'smallsubscribers');
                        }
                    }
                })
                .catch(function(response){
                    preloader.dis('wizardController-getBudget',response.data);
                    if ($rootScope.user) {
                        if ($rootScope.user.userData.role !== 'ADMIN') {
                            modalService.openModal('smallSubscribers', {}, 'md', 'smallsubscribers');
                            $location.url('/');
                        } else {
                            modalService.openModal('smallSubscribers', {}, 'md', 'smallsubscribers');
                        }
                    }
                })
        }

        // Создание розыгрыша и переход на страницу розыгрыша
        function goToGiveAwayPage(id, count) {
            preloader.act('wizardController-goToGiveAwayPage');
            var data = {
                count: count
            };
            var postUrl = 'api/raffle/create/' + id;
            $http.post(postUrl, data)
                .then(function(response) {
                    var locationUrl = '/'+ response.data.link + '?modal=rafflefaq';
                    $location.url(locationUrl);
                    preloader.dis('wizardController-goToGiveAwayPage');
                })
                .catch(function(response){
                    if (response.data.error.type == 'RaffleRestrictionException') {
                        modalService.openModal('wizardErrors', {}, 'md', 'wizarderrors');
                    }
                    preloader.dis('wizardController-goToGiveAwayPage', response.data);
                })
        }

        // Автоматический переход на второй шаг (вызыыается из других функций)
        function autoGoToStep2() {
            vm.step1 = false;
            vm.step2 = true;
            console.log('делаю сценарий');
            setTimeout(function(){
                $('html,body').animate({scrollTop: $('#wizard-step2').offset().top }, "slow");
            },400);

        }


    }

})();