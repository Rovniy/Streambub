(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminCreateNews', adminCreateNews);

    adminCreateNews.$inject = ['userService','$location', 'preloader','$http','FileUploader'];

    function adminCreateNews(userService,$location, preloader,$http,FileUploader) {
        var vm = this;
        vm.uploader = new FileUploader({
            url: '/api/files/upload'
        });
        vm.uploadImgs = new FileUploader({
            url: '/api/files/upload'
        });
        vm.oneTry = false;
        vm.tags = [];
        vm.textRedactor = {}; //Настройки редактора
        vm.textRedactor.customMenu = [
            ['bold', 'italic', 'underline', 'strikethrough'],
            ['left-justify', 'center-justify', 'right-justify'],
            ['format-block'],
            ['font-size'],
            ['remove-format'],
            ['ordered-list', 'unordered-list'],
            ['code', 'quote', 'paragraph'],
            ['link', 'image']
        ]; //Настройки редактора

        vm.createNews = createNews;
        vm.completeNew = completeNew;

        activate();

        function activate() {
            checkAdminRules();
            getCategories();

        }

        // Проверка юзера на админа
        function checkAdminRules() {
            preloader.act('adminStreamersStreamersList');
            if (!userService.isAdmin()) {
                preloader.dis('adminStreamersStreamersList');
                //$location.url('/');
            } else {
                preloader.dis('adminStreamersStreamersList');
            }
        }

        //Получение списка категорий
        function getCategories() {
            $http.get('/api/news/categories')
                .then(function(response){
                    vm.allCategories = response.data.data;
                })
        }

        function createNews() {
            var data = {
                category: vm.selectedCategory,
                images: vm.coverArr,
                name: [
                    {
                        "lang":"ru",
                        "text": vm.newTitle
                    }
                ],
                text: [
                    {
                        "lang":"ru",
                        "text": vm.textAreaFull
                    }
                ],
                shortDesc: [
                    {
                        "lang":"ru",
                        "text": vm.textAreAnons
                    }
                ],
                tags: vm.tags.replace(/\s+/g,'').split(',')
            };
            $http.post('/api/adm/news/create',data)
                .then(function(){
                    vm.oneTry = false;
                    vm.uploader.queue = [];
                    vm.allOk = true;
                    vm.selectedCategory = null;
                    vm.newTitle = null;
                    vm.textAreaFull = null;
                    vm.textAreAnons = null;
                    vm.tags = [];
                })

        }

        /*function tagsToArray(tags){
            vm.tagsArray = vm.tags.split(',');
        }*/

        function completeNew() {
            if (vm.oneTry) {
                vm.createNews();
            } else {
                vm.uploader.uploadAll();
            }
        }

        vm.uploader.onSuccessItem = function(response) {
            vm.coverArr = [];
            var resp = JSON.parse(response._xhr.response);
            vm.coverArr.push(resp.data.value[0].value);
            vm.oneTry = true;
            vm.createNews();
        };

        vm.uploadImgs.onSuccessItem = function(response) {
            vm.imgServerUrl = '';
            var arrImgs = [];
            var resp = JSON.parse(response._xhr.response);
            arrImgs.push(resp.data.value[0].value);
            var postData = {
                path: '/news/misc',
                fileNames: arrImgs
            };
            $http.post('api/files/move', postData)
                .then(function(datka){
                    vm.imgServerUrl = datka.data.data[0];
                });
            vm.uploadImgs.queue = [];
        };

    }})();
