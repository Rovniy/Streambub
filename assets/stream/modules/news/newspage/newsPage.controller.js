(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('newsPageController', newsPageController);

    newsPageController.$inject = ['modalService','$routeParams','$http','preloader','config','$sce'];

    function newsPageController(modalService,$routeParams,$http,preloader,config,$sce) {
        var vm = this;
        vm.newsId = $routeParams.id;
        vm.config = config;
        vm.newUrl = window.location.href;

        vm.openAddmodal = openAddmodal;
        vm.postSocial = postSocial;
        vm.to_trusted = to_trusted;

        activate();

        ////////////////

        function activate() {
            getNewsData();
            getNewsList();
        }

        function openAddmodal() {
            modalService.openModal('newsAddMore', {}, 'md', 'newsaddmore');
        }

        function getNewsData() {
            preloader.act('newsPageController-getNewsData');
            var getUrl = '/api/news/' + vm.newsId;
            $http.get(getUrl)
                .then(function(response){
                    vm.newsData = response.data.data;
                    preloader.dis('newsPageController-getNewsData');
                })
                .catch(function(){
                    preloader.dis('newsPageController-getNewsData');
                })
        }

        function to_trusted(html_code) {
            return $sce.trustAsHtml(html_code);
        }


        function getNewsList() {
            preloader.act('newsPageController-getNewsList');
            $http.get('/api/news/list?page=0&limit=3')
                .then(function(response){
                    vm.news = response.data.data;
                    preloader.dis('newsPageController-getNewsList');
                })
                .catch(function(){
                    preloader.dis('newsPageController-getNewsList');
                })
        }

        // Шаринг новости в соц.сети
        function postSocial() {
            FB.init({
                appId      : '1770916429852830',
                status     : true,
                cookie     : true,
                xfbml      : true,
                version    : 'v2.7'
            });
            FB.ui(
                {
                    method: 'feed',
                    name: vm.newsData.name[0].text,
                    picture: 'https://streampub.net' + vm.newsData.images[0].imageLink,
                    description: vm.newsData.shortDesc[0].text,
                    link: window.location.href
                }
            );
        }
    }
})();