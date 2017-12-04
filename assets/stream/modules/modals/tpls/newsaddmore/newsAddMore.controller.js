(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('newsAddMoreController', newsAddMoreController);

    newsAddMoreController.$inject = ['$http'];

    function newsAddMoreController($http) {
        var vm = this;
        vm.thatsok = false;

        vm.msgPost = msgPost;

        function msgPost(email,text) {
            var data = {
                name: email,
                text: text
            };
            $http.post('/api/news/request',data)
                .then(function(){
                    vm.thatsok = true;

                })
        }

    }

})();