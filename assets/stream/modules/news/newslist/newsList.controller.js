(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('newsListController', newsListController);

    newsListController.$inject = ['$http','preloader','$sce'];

    function newsListController($http,preloader,$sce) {
        var vm = this;
        vm.counter = 0;
        vm.news = [];
        vm.currentDay = new Date();
        vm.getUrl = '/api/news/list?page='+ vm.counter +'&limit=12';
        vm.newsEnd = false;

        vm.loadMoreNews = loadMoreNews;
        vm.to_trusted = to_trusted;

        activate();

        ////////////////

        function activate() {
            preloader.act('newsListController-getRafflesHistory');
            getNewsList();
        }

        function getNewsList() {
            $http.get(vm.getUrl)
                .then(function(response){
                    if (response.data.data.length < 12) {
                        vm.newsEnd = true;
                    }
                    response.data.data.forEach(function(f){
                        vm.news.push(f);
                    });
                    preloader.dis('newsListController-getRafflesHistory');
                })
                .then(function(){
                    vm.news.forEach(function(f){
                        f.tags.forEach(function(a){
                            if (a == 'TOP') {
                                vm.mainNew = f;
                            }
                        })
                    });
                })
                .catch(function(){
                    preloader.dis('newsListController-getRafflesHistory');
                })
        }

        function to_trusted(html_code) {
            return $sce.trustAsHtml(html_code);
        }

        function loadMoreNews() {
            vm.counter = vm.counter + 1;
            vm.getUrl = '/api/news/list?page='+ vm.counter +'&limit=12';
            getNewsList();
        }

    }
})();