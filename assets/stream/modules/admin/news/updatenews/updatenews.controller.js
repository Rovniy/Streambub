(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminUpdateNews', adminUpdateNews);

    adminUpdateNews.$inject = ['userService','$location', 'preloader','$http','FileUploader','$rootScope'];

    function adminUpdateNews(userService,$location, preloader,$http,FileUploader,$rootScope) {
        var vm = this;
        vm.news = {
            "category": "1",
            "images": ["8fdd9d4e-fe9d-4294-a24e-1553c62e62d0"],
            "name": [{"lang": "ru", "text": "Викинги жгут"}],
            "text": [{
                "lang": "ru",
                "text": "Тест<div><br></div><div><img src=\"/img/news/misc/viking2.jpg&#10;\"><br></div>"
            }],
            "shortDesc": [{"lang": "ru", "text": "Тест<div><img src=\"/img/news/misc/viking3.jpg\"><br></div>"}],
            "tags": ["тест", "Розыгрыши"]
        };




        vm.uploader = new FileUploader({
            url: '/api/files/upload'
        });
        vm.uploadImgs = new FileUploader({
            url: '/api/files/upload'
        });
        vm.oneTry = false;
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

        vm.updateNews = updateNews;
        vm.completeNew = completeNew;

        activate();

        function activate() {
            getNewsInfo();
            checkAdminRules();
            getCategories();

        }


        function getNewsInfo(){
            vm.news = $rootScope.postNewsDataForUpdate;
            $rootScope.postNewsDataForUpdate = undefined;
            console.log('vm.news',vm.news);

            vm.selectedCategory = vm.news.category.id;
            // vm.coverArr = vm.news.images;
            vm.newTitle = vm.news.name[0].text;
            vm.textAreaFull = vm.news.text[0].text;
            vm.textAreAnons = vm.news.shortDesc[0].text;
            vm.tags = vm.news.tags.join(',');
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

        function updateNews() {
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
            $http.post('/api/adm/news/'+ vm.news.id + '/update',data)
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
            if (vm.oneTry || vm.uploader.queue.length == 0) {
                vm.updateNews();
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
