(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminAdsCreateCompany', adminAdsCreateCompany);

    adminAdsCreateCompany.$inject = ['$http','$location','preloader', '$rootScope','modalService','intercomService'];

    function adminAdsCreateCompany($http, $location, preloader, $rootScope,modalService,intercomService) {
        var vm = this;
        vm.images = [];
        vm.targetList = [];
        vm.banList = [];
        vm.adsLink = '';
        vm.companyName = '';
        vm.companyEmail = '';
        vm.companyActive = false;


        vm.addToActionsList = addToActionsList;
        vm.deleteFromTargetList= deleteFromTargetList;
        vm.addToBanList = addToBanList;
        vm.removeFromBanList = removeFromBanList;
        vm.createAdsOnServer = createAdsOnServer;
        vm.getAdsList = getAdsList;
        vm.uploadImage = uploadImage;

        intercomService.on('complete-Upload-Image-From-Modal-to-Admin', saveUrl);

        activate();

        function activate() {

        }
        function saveUrl(data) {
            if (data.key == 'background') {
                vm.images[0] = {
                    "type": "BACKGROUND",
                    "link": vm.adsLink,
                    "src": data.url
                }
            } else if (data.key == 'modal') {
                vm.images[1] = {
                    "type": "MODAL",
                    "link": vm.adsLink,
                    "src": data.url
                }
            }
        }

        function uploadImage(type) {
            $rootScope.uploadImageFromModal = {
                key: type
            };
            modalService.openModal('uploadImage', {}, 'md', 'upload-image');
        }
        // добавление в список тасков для кампании
        function addToActionsList() {
            var sampleObj = {
                name: vm.selectTargetAction,
                link: null,
                luck: null
            };
            vm.targetList.push(sampleObj);
        }

        // Удаление элемента из списка тасков
        function deleteFromTargetList(key) {
            vm.targetList.splice(key,1);
        }

        // Добавление стримера в бан-лист
        function addToBanList(data) {
            vm.banList.push(data);
            vm.banListItem = null;
        }

        // Удаление стримера из списка бан-листа
        function removeFromBanList(key){
            vm.banList.splice(key,1);
        }


        /**
         * Отправка всех данных для создания рекламной кампании
         */
        function createAdsOnServer() {
            preloader.act('adminAdsCreateCompany-createAdsOnServer');
            var sponsorId;
            vm.sponsorsResult.forEach(function(f){
                if (f.name == vm.adsName) {
                    sponsorId = f.id;
                }
            });
            var data = {
                "name": vm.companyName,
                "sponsor": sponsorId,
                "email": vm.companyEmail,
                "startDate": vm.startDate,
                "endDate": vm.endDate,
                "active": vm.companyActive,
                "tasks": vm.targetList,
                "brandings": vm.images,
                "streamersBan": vm.banList
            };
            $http.post('/api/adm/campaign/create', data)
                .then(function(){
                    vm.success = 'Все ок. Кампания завершена';
                    preloader.dis('adminAdsCreateCompany-createAdsOnServer');
                })
                .catch(function(response){
                    vm.error = response.data;
                    preloader.dis('adminAdsCreateCompany-createAdsOnServer', response);
                })
        }


        /**
         * Фильтр по спискам рекламных кампаний
         * @param val - то, что я пишу в строке
         * @returns {*} - результат поиска по массиву
         */
        function getAdsList(val){
            var getUrl;
            if (val.length > 0) {
                getUrl = '/api/adm/sponsor/list?orderBy=name&name=' + val;
            } else {
                getUrl = '/api/adm/sponsor/list?orderBy=name';
            }
            return $http.get(getUrl)
                    .then(function(response){
                        vm.sponsorsResult = response.data.data;
                        console.log(vm.sponsorsResult);
                        return response.data.data.map(function(item){
                            return item;
                        });
            });
        }

    }})();
