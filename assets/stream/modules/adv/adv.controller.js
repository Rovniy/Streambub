(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('advController', advController);

    advController.$inject = ['FileUploader','modalService', '$http','$scope'];

    function advController(FileUploader,modalService, $http,$scope) {
        var vm = this;
        vm.cdCount = 0;
        vm.tabs = 0;
        vm.countLangFlag = 0;
        vm.countLang = 0;
        vm.countGamesFlag = 0;
        vm.countGames = 0;
        vm.countPlatformFlag = 0;
        vm.countPlatform = 0;
        vm.newPrizePrise = 0;
        vm.newPrizeQuantity = 0;
        vm.checkboxAgree = false;
        vm.othercd = false;
        vm.prizes = 1;
        vm.targetPrice = 0;
        vm.users = 8000;
        vm.cdPrice = 0;
        vm.uploader = new FileUploader({
            url: '/api/files/upload'
        });
        vm.images = [];
        vm.slider = {
            value: 6,
            options: {
                showTicks: true,
                floor: 0,
                ceil: 18,
                step: 1,
                hidePointerLabels: true,
                hideLimitLabels: true,
                stepsArray: [
                    {value: 1, legend: '500'},
                    {value: 2, legend: '1000'},
                    {value: 3, legend: '2000'},
                    {value: 4, legend: '4000'},
                    {value: 5, legend: '6000'},
                    {value: 6, legend: '8000'},
                    {value: 7, legend: '10000'},
                    {value: 8, legend: '12000'},
                    {value: 9, legend: '14000'},
                    {value: 10, legend: '16000'},
                    {value: 11, legend: '18000'},
                    {value: 12, legend: '20000'},
                    {value: 13, legend: '22000'},
                    {value: 14, legend: '24000'},
                    {value: 15, legend: '26000'},
                    {value: 16, legend: '28000'},
                    {value: 17, legend: '30000'},
                    {value: 18, legend: '30000+'}
                ],
                onChange: swipeVal()


            }
        };

        vm.allCost = 0.03;

        vm.cd = [
            {
                name: 'Visit external URL',
                tag: 'link',
                status: false,
                val: 20,
                placeholder: 'Please insert the link you want participants to click during the campaign',
                link: ''
            },
            {
                name: 'Join Vkontakte group',
                tag: 'joinvkgroup',
                status: false,
                val: 30,
                placeholder: 'Please insert Vkontakte group ID (is shown in the group settings)',
                link: ''
            },
            {
                name: 'Join Facebook group',
                tag: 'joinfbgroup',
                status: false,
                val: 30,
                placeholder: 'Please insert the Facebook group ID (is shown in the group settings)',
                link: ''
            },
            {
                name: 'Like the post in Vkontakte',
                tag: 'likepostvk',
                status: false,
                val: 10,
                placeholder: 'Please insert the link to the post you want to be liked',
                link: ''
            },
            {
                name: 'Like the post in Facebook',
                tag: 'likepostfb',
                status: false,
                val: 10,
                placeholder: 'Please insert the link to the post you want to be liked',
                link: ''
            },
            {
                name: 'Like the page in Facebook',
                tag: 'likepagefb',
                status: false,
                val: 15,
                placeholder: 'Please insert the link to the page you want to be liked',
                link: ''
            },
            {
                name: 'Watch a video',
                tag: 'video',
                status: false,
                val: 1.5,
                placeholder: 'Please insert the link to a YouTube video you want to be watched',
                link: ''
            },
            {
                name: 'Other',
                tag: 'other',
                status: false,
                val: 0,
                placeholder: 'Please tell us what other actions you want to be performed and we’ll get back to you with our offer shortly',
                link: ''
            }
        ];
        vm.lang = [
            {
                name: 'English',
                status: true
            },
            {
                name: 'Russian',
                status: true
            },
            {
                name: 'French',
                status: true
            },
            {
                name: 'German',
                status: true
            },
            {
                name: 'Polish',
                status: true
            }
        ];
        vm.games = [
            {
                name: 'Hearthstone',
                status: true
            },
            {
                name: 'Counter-Strike Global Offensive',
                status: true
            },
            {
                name: 'Dota 2',
                status: true
            },
            {
                name: 'League of Legends',
                status: true
            },
            {
                name: 'World of Tanks',
                status: true
            },
            {
                name: 'FIFA 2017',
                status: true
            },
            {
                name: 'Indie gammes',
                status: true
            }
        ];
        vm.platforms = [
            {
                name: 'Twitch',
                status: true
            },
            {
                name: 'YouTube',
                status: true
            },
            {
                name: 'Hitbox',
                status: true
            },
            {
                name: 'Facebook',
                status: true
            },
            {
                name: 'Vkontakte',
                status: true
            }
        ];
        
        vm.cdCounter = cdCounter;
        vm.langCounter = langCounter;
        vm.gamesCounter = gamesCounter;
        vm.platformCounter = platformCounter;
        vm.sendReport = sendReport;
        vm.checkAllMoney = checkAllMoney;

        activate();

        ////////////////

        function activate() {
            checkAllMoney();

        }

        $scope.$watch("vm.slider.value", function() {
            swipeVal(vm.slider.value);
            checkAllMoney();
        });
        $scope.$watch("vm.cdPrice", function() {
            vm.finalCost = vm.allCost + vm.cdPrice;
        });

        function checkAllMoney() {
            if (vm.prizes == 1) {
                vm.addCost = vm.users * 0.03;
            } else if (vm.prizes == 2) {
                vm.addCost = 0;
            }
        }

        function swipeVal(val) {
            switch (val) {
                    case 1 : vm.users = 500;
                        break;
                    case 2 : vm.users = 1000;
                        break;
                    case 3 : vm.users = 2000;
                        break;
                    case 4 : vm.users = 4000;
                        break;
                    case 5 : vm.users = 6000;
                        break;
                    case 6 : vm.users = 8000;
                        break;
                    case 7 : vm.users = 10000;
                        break;
                    case 8 : vm.users = 12000;
                        break;
                    case 9 : vm.users = 14000;
                        break;
                    case 10 : vm.users = 16000;
                        break;
                    case 11 : vm.users = 18000;
                        break;
                    case 12 : vm.users = 20000;
                        break;
                    case 13 : vm.users = 22000;
                        break;
                    case 14 : vm.users = 24000;
                        break;
                    case 15 : vm.users = 26000;
                        break;
                    case 16 : vm.users = 28000;
                        break;
                    case 17 : vm.users = 30000;
                        break;
                    case 18 : vm.users = 30000;
                        break;

                }
        }

        function cdCounter() {
            vm.cdPrice = 0;
            vm.cdCount = 0;
            vm.cd.forEach(function(f){
                if (f.status == true) {
                    vm.cdCount++;
                    vm.cdPrice = vm.cdPrice + f.val/100;
                }
            });
        }

        function langCounter() {
            if (!vm.countLangFlag) {
                vm.lang.forEach(function(f){
                    if (f.status == false) {
                        vm.countLangFlag = true;
                        vm.countLang++;
                        vm.allCost = vm.allCost + 0.005;
                        setAddTargetingPrice();
                    }
                });
            } else {
                vm.countLang = 0;
                vm.lang.forEach(function(f){
                    if (f.status == false) {
                        vm.countLang++;
                    }
                });
                if (vm.countLang == 0) {
                    vm.countLangFlag = false;
                    setAddTargetingPrice();
                    vm.allCost = vm.allCost - 0.005;
                }
            }
        }

        function gamesCounter() {
            if (!vm.countGamesFlag) {
                vm.games.forEach(function(f){
                    if (f.status == false) {
                        vm.countGamesFlag = true;
                        vm.countGames++;
                        vm.allCost = vm.allCost + 0.005;
                        setAddTargetingPrice();
                    }
                });
            } else {
                vm.countGames = 0;
                vm.games.forEach(function(f){
                    if (f.status == false) {
                        vm.countGames++;
                    }
                });
                if (vm.countGames == 0) {
                    vm.countGamesFlag = false;
                    vm.allCost = vm.allCost - 0.005;
                    setAddTargetingPrice();
                }
            }
        }

        function platformCounter() {
            if (!vm.countPlatformFlag) {
                vm.platforms.forEach(function(f){
                    if (f.status == false) {
                        vm.countPlatformFlag = true;
                        vm.countPlatform++;
                        vm.allCost = vm.allCost + 0.005;
                        setAddTargetingPrice();
                    }
                });
            } else {
                vm.countPlatform = 0;
                vm.platforms.forEach(function(f){
                    if (f.status == false) {
                        vm.countPlatform++;
                    }
                });
                if (vm.countPlatform == 0) {
                    vm.countPlatformFlag = false;
                    vm.allCost = vm.allCost - 0.005;
                    setAddTargetingPrice();
                }
            }
        }

        function setAddTargetingPrice() {
            var counter = 0;
            if (vm.countLang > 0) {
                counter++;
            }
            if (vm.countGames > 0) {
                counter++;
            }
            if (vm.countPlatform > 0) {
                counter++;
            }
            vm.targetPrice = 0.005*counter;

        }

        vm.uploader.onSuccessItem = function(response) {
            var resp = JSON.parse(response._xhr.response);
            vm.images.push(resp.data.value[0].value);
            sendReport()
        };

        function sendReport() {
            var prizes = {};
            var actions = [];
            if (vm.prizes == 1) {
                prizes = {
                    name: 'Use any prizes as you see fit'
                }
            } else if (vm.prizes == 2) {
                prizes = {
                    name: vm.newPrizeName,
                    price: vm.newPrizePrise,
                    quantity: vm.newPrizeQuantity,
                    img: vm.images
                }
            }
            vm.cd.forEach(function(f){
                if (f.status == true) {
                    actions.push(f);
                }
            });

            vm.postData = {
                viewers: vm.users,
                actions: actions,
                lang: vm.lang,
                games: vm.games,
                platforms: vm.platforms,
                bannedStreamers: vm.bannedStreamers,
                link: vm.website,
                prizes: prizes,
                requestDeposit: ((vm.users * 0.03) + (vm.users * 0.3 * vm.cdPrice) + vm.addCost)*100,
                guaranteed: {
                    partipiants: vm.users,
                    allPrice: vm.users * 0.03,
                    pricePerPart: vm.finalCost
                },
                forecast: {
                    actions: vm.users * 0.3 * vm.cdCount,
                    price: vm.users * 0.3 * vm.cdPrice,
                    maxBudget: vm.users * 0.6 * vm.cdPrice
                },
                images: vm.images
            };
            $http.post('/api/adv/create',vm.postData )
                .then(function(){
                modalService.openModal('advRegistration', '', 'md', 'advregistration');
            });
            console.log(vm.postData);
        }

    }
})();