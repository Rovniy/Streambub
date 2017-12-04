(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('newsListCategoryController', newsListCategoryController);

    newsListCategoryController.$inject = ['$http','preloader','$routeParams','$sce'];

    function newsListCategoryController($http,preloader,$routeParams,$sce) {
        var vm = this;
        vm.catID = $routeParams.rubric;
        vm.counter = 0;
        vm.news = [];
        vm.currentDay = new Date();
        vm.getUrl = 'api/news/list?page='+ vm.counter +'&limit=15&cat=' + vm.catID;

        vm.loadMoreNews = loadMoreNews;
        vm.to_trusted = to_trusted;

        activate();

        ////////////////

        function activate() {
            getAllCategories();
            getNewsList();
        }

        function getAllCategories() {
            $http.get('/api/news/categories')
                .then(function(response){
                    vm.allCategories = response.data.data;
                })
                .then(function(){
                    if (vm.allCategories) {
                        for (var item in vm.allCategories) {
                            if (vm.allCategories[item].id == vm.catID) {
                                vm.nowCat = vm.allCategories[item];
                            }
                        }
                    }
                })

        }
        function getNewsList() {
            preloader.act('newsListCategoryController-getRafflesHistory');
            $http.get(vm.getUrl)
                .then(function(response){
                    response.data.data.forEach(function(f){
                        vm.news.push(f);
                    });
                    preloader.dis('newsListCategoryController-getRafflesHistory');
                })
                .then(function(){
                    vm.news.forEach(function(f){
                        f.tags.forEach(function(a){
                            if (a == '4444') {
                                vm.mainNew = f;
                            }
                        })
                    });
                })
                .catch(function(){
                    preloader.dis('newsListCategoryController-getRafflesHistory');
                })
        }

        function to_trusted(html_code) {
            return $sce.trustAsHtml(html_code);
        }

        function loadMoreNews() {
            vm.counter++;
            vm.getUrl = '/api/news?page='+ vm.counter +'&perPage=15&cat=' + vm.catID;
            getNewsList();
        }

    }
})();