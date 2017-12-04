(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('adminNewsList', adminNewsList);

    adminNewsList.$inject = ['userService','$location', 'preloader','$http','$rootScope'];

    function adminNewsList(userService,$location, preloader,$http,$rootScope) {
        var vm = this;
        vm.itemsPerPage = 100; // Запрос в базу за всеми пользователями
        vm.count =0;
        vm.paginationLength = 5000000;
        vm.currentPage = 1;


        vm.postActivate = postActivate;
        vm.getPageData = getPageData;

        vm.updateNews = updateNews;
        vm.deleteNews = deleteNews;

        activate();

        function activate() {
            checkAdminRules();
            // getNewsList();
            getPageData();
        }


        // Проверка юзера на админа
        function checkAdminRules() {
            preloader.act('adminStreamersStreamersList');
            if (!userService.isAdmin()) {
                preloader.dis('adminStreamersStreamersList');
                $location.url('/');
            } else {
                preloader.dis('adminStreamersStreamersList');
            }
        }

        function getNewsList() {
            preloader.act('newsListController-getRafflesHistory');
            vm.getUrl = '/api/adm/news/list?page=0&limit=100';
            $http.get(vm.getUrl)
                .then(function(response){
                    vm.news = response.data.data;
                    preloader.dis('newsListController-getRafflesHistory');
                })
                .catch(function(){
                    preloader.dis('newsListController-getRafflesHistory');
                })
        }

        function getPageData(){
            var page = vm.currentPage - 1 || 0;
            preloader.act('newsListController-getRafflesHistory');
            $http
                .get('/api/adm/news/list?page='+page+'&limit='+vm.itemsPerPage)
                .then(function (response) {
                    vm.news = response.data.data.news;
                    vm.count = response.data.data.count;
                    vm.paginationLength = vm.count/vm.itemsPerPage+1;
                    preloader.dis('newsListController-getRafflesHistory');
                })
                .catch(function(){
                    preloader.dis('newsListController-getRafflesHistory');
                });
        }

        function postActivate(id) {
            setTimeout(function(){
                // if (status == true) {
                    var data = {};
                    var postUrl = '/api/adm/news/active/'+id;
                    $http.post(postUrl, data);
                // } else if (status == false) {
                //     var data = {};
                //     var postUrl = '/api/adm/news/'+id;
                //     $http.delete(postUrl, data)
                //
                // }
            },500)
        }

        function updateNews(row){
            $rootScope.postNewsDataForUpdate = row;
            $location.url('/admin/news/update');
        }

        function deleteNews(id) {
            setTimeout(function(){
                var data = {};
                $http.delete('/api/adm/news/'+id, data);
                getPageData();
            },500)
        }

    }})();
