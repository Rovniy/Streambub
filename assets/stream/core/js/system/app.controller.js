(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('AppController', AppController);

    AppController.$inject = ['userService', 'intercomService', '$location', 'preloader', '$rootScope', 'adminService', 'errorHandler','localizationService', 'config','$cookies','$window','$http'];

    function AppController(userService, intercomService, $location, preloader, $rootScope, adminService, errorHandler,localizationService, config, $cookies, $window,$http) {
        var vm = this;
        vm.config = config;
        $rootScope.widgetOpen = false;
        $rootScope.adblocker = true;
        $rootScope.trackOutboundLink = trackOutboundLink;
        $rootScope.trackClick = trackClick;
        $rootScope.currentRate = currentRate;
        $rootScope.getLanguage = getLanguage;

        vm.getLanguage = getLanguage;

        Object.defineProperty($rootScope, 'userProfile', {
            get: function () {
                return userService.getUserProfile();
            }
        });

        activate();

        ////////////////

        function activate() {
            //console.log('window.location.href',window.location.href);

            getUrlData();
            getSessionRedirect();
            checkAdblocker();
            trackLocationChange();


            //Попытка получения userProfile
            userService
                .loadUserProfile()
                .then(checkMyProfile);

            //Реакция на вход / выход на любой вкладке
            intercomService.on('authentication.login', _onLogin);


            // Выключение всех флагов при смене URL
            $rootScope.$on("$routeChangeSuccess", function() {
                $rootScope.widgetOpen = false;
                $rootScope.landingPage = false;
            });
        }

        // Получение язяыка сайта
        function getLanguage() {
            return localizationService.getLanguage();
        }

        /**
         * Проверка наличия включенного AD blocker'a
         */
        function checkAdblocker() {
            if ($window.adblocker) {
                $rootScope.adblocker = false;
            }
        }

        /**
         * Конвертация валюты из центов в текущую валюту, исходя из яыка сайта
         * @param value - принимает значение в центах
         * @param roundCount - до какого порядка нужно округлять число
         * @returns {string} - возвращает форматированное значение денежных средств
         *
         */
        function currentRate(value, roundCount) {
            if (!roundCount) {
                if (value) {
                    var lang = getLanguage();
                    if (lang === 'RU') {
                        // return (value * vm.config.dollar / 100).toFixed(0) + ' руб.';
                        return (Math.round((value * vm.config.dollar / 100)/100) * 100) + ' руб.';
                    } else if (lang == 'EN') {
                        return '$ ' + (value / 100).toFixed(2);
                    }
                } else return '0';
            } else {
                if (roundCount == 100) {
                    var roundedValue = value * vm.config.dollar / 100;
                    if (roundedValue < 100) {
                        return 100 + ' руб.';
                    } else if (roundedValue >= 100) {
                        return (Math.round(roundedValue/100) * 100) + ' руб.';
                    }
                } else {
                    return 'ошибка'
                }

            }

        }

        // Получение данных по пользователю
        function checkMyProfile() {
            preloader.act('appController-onLogin');
            return userService
                .loadUserProfile()
                .then(function () {
                    $rootScope.user = userService.getUserProfile();
                    $rootScope.user.accounts = {};
                    console.info('Userprofile: Пользователь:', $rootScope.user.userData.name, '| id:', $rootScope.user.userData.id, '| Email:', $rootScope.user.userData.email, '| Luck:', $rootScope.user.userData.luck);
                    preloader.dis('appController-onLogin');
                })
                .then(function(){
                    $rootScope.user.userData.providers.forEach(function(f){
                        if (f == 'password') $rootScope.user.accounts.password = true;
                    })
                })
                .catch(function(){
                    preloader.dis('appController-onLogin');
                })
        }


        /**
         * Слежение за изменением URL и переходами на нужные страницы
         */
        function trackLocationChange() {
            $rootScope.$on('$locationChangeSuccess', function (object, newLocation, previousLocation) {
                if (newLocation.indexOf('global-luck') != -1) {
                    $http.post('/api/global/log',{
                            previousUrl: previousLocation
                        })
                    
                }
            });
        }
        

        //Событие, если пользователь вошел в аккаунт
        function _onLogin() {
            preloader.act('appController-onLogin');
            return userService
                .loadUserProfile()
                .then(function () {
                    $rootScope.user = userService.getUserProfile();
                    if ($rootScope.user.userData.status == 'STREAMER') {
                        $location.url('/dashboard');
                    }
                    console.log('Userprofile: Пользователь:', $rootScope.user.userData.name, ', id:', $rootScope.user.userData.id);
                    preloader.dis('appController-onLogin');
                })
                .catch(function(){
                    preloader.dis('appController-onLogin');
                })

        }

        /**
         * Функция, которая отслеживает клики по исходящим ссылк в Analytics.
         * Эта функция применяет в качестве аргумента строку с действительным URL, после чего использует ее
         * как ярлык события. Если указать beacon в качестве метода передачи, данные обращений
         * будут отправляться с использованием метода navigator.sendBeacon в поддерживающих его браузерах.
         */
        function trackOutboundLink(url) {
            // Отключение аналитики, если происходит запуск с локальной машини
            console.log(url);
            if (!vm.config.debug) {
                ga('send', 'event', 'outbound', 'click', url, {
                    'transport': 'beacon'
                });
                yaCounter39021610.reachGoal('outbound_click', {'url': url});
            }

        }

        // Отправка Google аналитики
        function trackClick(link,tag) {
            // Отключение аналитики, если происходит запуск с локальной машини
            //console.log(link +'/' + tag);
            if (!vm.config.debug) {
                ga('send', 'event', 'click', link, tag);
                yaCounter39021610.reachGoal('link_click', {'tag': tag});
            }
        }


        //Если в GET передается хоть что-то, то делай с ним это...
        function getUrlData() {
            vm.getUrlData = $location.search();
            if (vm.getUrlData.error) {
                intercomService.emit('errorHandler.login.error');
            } else if (vm.getUrlData.ref) {
                $cookies.put('referral_id', vm.getUrlData.ref)
            } else if (vm.getUrlData.utm) {
                $cookies.put('utm', vm.getUrlData.utm)
            }
        }

        // Редирект куда угодно откуда угодно
        function getSessionRedirect() {
            var redirectUrl = sessionStorage.getItem('redirectUrl');
            if (redirectUrl) {
                sessionStorage.removeItem('redirectUrl');
                $location.url(redirectUrl);
            }
        }
    }

})();

