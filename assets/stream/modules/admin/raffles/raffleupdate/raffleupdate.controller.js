(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminRaffleUpdate', adminRaffleUpdate);

    adminRaffleUpdate.$inject = ['$http','$location','$rootScope'];

    function adminRaffleUpdate($http,$location,$rootScope) {
        var vm = this;
        vm.raffle = {
            "gifts": [],
            "organizer": "16b90fd5-b1e0-4050-9e41-6be5401ee679",
            "shortLink": "testLink",
            "name": "testName",
            "promo": true,
            "reject": false,
            "pricePerUser": 50,
            "tags": ["welcome", "leon"],
            "tasks": [{"taskType": "SUBSCRIBE_VK", "id": 1}, {"taskType": "SUBSCRIBE_VK", "id": 400}]
        };
        vm.giftLister = [];

        vm.saveRaffle = saveRaffle;
        vm.findAndAddGift = findAndAddGift;
        vm.findAndAddStreamer = findAndAddStreamer;
        vm.addToActionsList = addToActionsList;
        vm.deleteGift = deleteGift;
        vm.deleteFromTargetList = deleteFromTargetList;


        activate();

        function activate() {
            getRaffleInfo(); //Получение передаваемых данных и очищение $rootScope
            getGiftsList(); //Получение списка призов
            getStreamersList(); //Получение списка стримеров
        }

        /**
         * Получение передаваемых данных и очищение $rootScope
         */
        function getRaffleInfo(){
            vm.raffle = $rootScope.postRaffleDataForUpdate;
            $rootScope.postRaffleDataForUpdate = undefined;
            console.log('vm.raffle',vm.raffle);
            var newGift;
            vm.raffle.gifts.forEach(function(f){
                newGift = {
                    gift: f.gift ? f.gift.id : 0,
                    giftCount: f.giftCount ? f.giftCount : 0,
                    price: f.price ? f.price : 0,
                    minMembers: f.minMembers ? f.minMembers : 0,
                    active: f.active || false
                };
                vm.giftLister.push(newGift);

            })

        }

        /**
         * Добавление нового приза к розыгрышу
         * @param id - ID приза
         */
        function findAndAddGift(id){
            var newGift;
            vm.giftList.forEach(function(f){
                if (f.id == id) {
                    newGift = {
                        gift: f.id,
                        giftCount: f.giftCount,
                        price: f.price,
                        minMembers: f.minMembers,
                        active: f.active
                    };
                    vm.raffle.gifts.push(newGift);
                }

            })
        }

        /**
         * Добавление нового стримера
         * @param id - ID поьзователя
         */
        function findAndAddStreamer(id){
            vm.streamersList.forEach(function(f){
                if (f.user.id == id) {
                    vm.raffle.organizer = f.user;
                    console.log(vm.raffle.organizer.id, vm.raffle.organizer.name);
                }
            })
        }

        /**
         * Получение списка призов
         */
        function getGiftsList() {
            $http.get('/api/adm/gift/list?page=0&perPage=10000')
                .then(function(response){
                    vm.giftList = response.data.data;
                })
        }

        /**
         * Получение списка стримеров
         */
        function getStreamersList() {
            $http.get('/api/adm/streamers?page=0&perPage=10000&searchString')
                .then(function(response){
                    vm.streamersList = response.data.data.userInfos;
                })
        }

        // добавление в список тасков для кампании
        function addToActionsList(type) {
            var sampleObj = {};
            if (type == 'CPA') {
                sampleObj = {
                    name: null,
                    luck: null,
                    id: null,
                    params: {
                        url: vm.url
                    },
                    taskType: type,
                    owner: null
                };
            } else {
                sampleObj = {
                    name: null,
                    luck: null,
                    id: null,
                    taskType: type
                };
            }
            vm.raffle.tasks.push(sampleObj);
        }

        /**
         * Удаление приза
         * @param key
         */
        function deleteGift(key) {
            vm.raffle.gifts.splice(key,1);
        }

        /**
         * Сохранение изменений розыгрыша
         */
        function saveRaffle(){
            var data = {
                gifts: vm.giftLister,
                organizer: vm.raffle.organizer.id,
                shortLink: vm.raffle.shortLink,
                name: vm.raffle.name,
                promo: vm.raffle.promo || false,
                reject: vm.raffle.rejected || false,
                pricePerUser: vm.raffle.pricePerUser || 0,
                tags: vm.raffle.tags || [],
                tasks: vm.raffle.tasks
            };
            var postUrl = '/api/adm/raffle/' + vm.raffle.id + '/update';
            $http.post(postUrl,data)
                .then(function(){
                    vm.ok = 'Сохранено'
                })

        }

        /**
         * Удаление таска из списка тасков
         * @param key
         */
        function deleteFromTargetList(key) {
            vm.raffle.tasks.splice(key,1);
        }


    }})();
