(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('createRaffleController', createRaffleController);

    createRaffleController.$inject = ['$rootScope','modalService','intercomService','$http','$location'];

    function createRaffleController($rootScope,modalService,intercomService,$http,$location) {
        var vm = this;
        vm.giftImage = '';
        vm.targetList = [];
        vm.quest = {
            id: null,
            name: null,
            taskType: null
        };
        
        vm.uploadImage = uploadImage;
        vm.addToActionsList = addToActionsList;
        vm.deleteFromTargetList = deleteFromTargetList;
        vm.createGiftAndRaffle = createGiftAndRaffle;

        intercomService.on('complete-Upload-Image-From-Modal-to-Admin', saveUrl);
        
        activate();

        ////////////////

        function activate() {
            
        }

        function uploadImage(type) {
            $rootScope.uploadImageFromModal = {
                key: type
            };
            modalService.openModal('uploadImage', {}, 'md', 'upload-image');
        }
        
        function saveUrl(data) {
            if (data.key == 'gift') {
                vm.giftImage = data.url;
            }
        }
        
        function createGiftAndRaffle() {
            vm.nameError = vm.descriptionError = vm.giftCountError = vm.minMembersError = vm.giftImageError = vm.linkError = false;
            if (!vm.name) vm.nameError = true;
            if (!vm.description) vm.descriptionError = true;
            if (!vm.giftCount) vm.giftCountError = true;
            if (!vm.minMembers) vm.minMembersError = true;
            if (vm.giftImage.length == 0) vm.giftImageError = true;
            if (!vm.link) vm.linkError = true;
            if (!vm.nameError && !vm.descriptionError && !vm.giftCountError && !vm.minMembersError && !vm.giftImageError && !vm.linkError) {
                var data = {
                    name: vm.name,
                    description: 'Данный розыгрыш запущен силами ' + $rootScope.user.userData.name + '. ' + vm.description,
                    count: vm.giftCount,
                    minMembers: vm.minMembers,
                    images: [vm.giftImage],
                    link: vm.link,
                    endDate: vm.endDate,
                    tasks: vm.targetList
                };
                $http.post('/api/raffle/own/create', data)
                    .then(function(response){
                        var link = response.data.link;
                        $location.url(link);
                    });
            }

        }

        // добавление в список тасков для кампании
        function addToActionsList() {
            var sampleObj = {
                taskType: vm.selectTargetAction,
                id: null,
                luck: 30,
                owner: "STREAMER"
            };
            vm.targetList.push(sampleObj);
        }

        // Удаление элемента из списка тасков
        function deleteFromTargetList(key) {
            vm.targetList.splice(key,1);
        }
        
        

    }
})();