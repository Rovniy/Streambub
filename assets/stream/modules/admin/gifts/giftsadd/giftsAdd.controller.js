(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminGiftsAdd', adminGiftsAdd);

    adminGiftsAdd.$inject = ['userService','$location', 'preloader', '$http','FileUploader'];

    function adminGiftsAdd(userService,$location, preloader, $http, FileUploader) {
        var vm = this;
        vm.uploader = new FileUploader({
            url: '/api/files/upload'
        });
        vm.money = false;
        vm.dateFormat = 'dd-MMMM-yyyy';
        vm.datePicker = false;
        vm.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };
        vm.altInputFormats = ['M!/d!/yyyy'];
        vm.images = [];

        vm.createGift = createGift;

        activate();

        function activate() {
            getCategories();
            getCampaings();
        }

        vm.uploader.onSuccessItem = function(response) {
            var resp = JSON.parse(response._xhr.response);
            vm.images.push(resp.data.value[0].value);
        };


        function getCategories() {
            $http.get('/api/categories')
                .then(function(response){
                    vm.categoriesList = response.data.data;
                })
        }
        function getCampaings() {
            $http.get('/api/adm/campaign/list')
                .then(function(response){
                    vm.campaignList = response.data.data;
                })
        }

        function createGift() {
            if (vm.downloadStatusOk) {
                postData();
            } else {
                vm.uploader.uploadAll();
            }

        }

        vm.uploader.onCompleteAll = function() {
            vm.downloadStatusOk = true;
            postData();

        };

        function postData() {
            // var spec = {special: true};
            var data = {
                name: vm.name,
                category: vm.category,
                price: vm.price,
                description: vm.description,
                count: vm.count,
                minMembers: vm.minMembers,
                campaign: vm.campaign,
                link: vm.link,
                endDate: vm.endDate,
                images: vm.images,
                paid: vm.money,
                promo: vm.promo,
                additionalInfo: {special: true},
                discountPrice: vm.discountPrice ? vm.discountPrice : null,
                discountMinMembers: vm.discountMinMembers ? vm.discountMinMembers : null
            };
            vm.success = undefined;
            vm.error = undefined;
            $http.post('/api/adm/gift/create', data)
                .then(function(response){
                    vm.downloadStatusOk = false;
                    vm.success = response.data;
                })
                .catch(function(response){
                    vm.error = response.data;
                })
        }

    }})();
