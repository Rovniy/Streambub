(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('raffleProcess', raffleProcess);

    raffleProcess.$inject = ['$http', '$rootScope', 'intercomService', '$scope', '$interval', '$location','$sce'];

    function raffleProcess($http, $rootScope, intercomService,$scope,$interval,$location,$sce) {
        var vm = this;
        vm.winners = undefined;
        vm.step1 = 3000;
        vm.raffleStep1 = false;
        vm.raffleStep2 = false;
        vm.raffleStep3 = false;
        vm.raffleStep4 = false;
        vm.cardLeft = 100;
        vm.okButton = false;
        vm.testStatus = false;
        vm.winnerNumberHide = false;
        vm.usersListVisible = false;
        vm.waitingRandomNumber = false;
        vm.winnerNumber = 0;
        vm.usersList = [];
        vm.flippedarray = [];
        vm.processCount = 1;
        vm.testData = {
            data:[
                {
                    "name":"R567657567_",
                    "luck":2,
                    "win":true,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reconnect_-profile_image-936c3b2ca6b444b5-300x300.jpeg"
                },
                {
                    "name":"flinrr",
                    "luck":1,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"aBratF"
                    ,"luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/abratf-profile_image-ce4470cc66c23a30-300x300.jpeg"
                },
                {
                    "name":"sarcasm223",
                    "luck":3,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"ReRuf",
                    "luck":3,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reruf-profile_image-ff8eda543753598d-300x300.jpeg"
                },
                {
                    "name":"MuctuQ",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/muctuq-profile_image-9f743baf5ad20595-300x300.jpeg"
                },
                {
                    "name":"Reconnect_",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reconnect_-profile_image-936c3b2ca6b444b5-300x300.jpeg"
                },
                {
                    "name":"flinrr",
                    "luck":1,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"aBratF"
                    ,"luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/abratf-profile_image-ce4470cc66c23a30-300x300.jpeg"
                },
                {
                    "name":"sarcasm223",
                    "luck":3,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                },
                {
                    "name":"ReRuf",
                    "luck":3,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reruf-profile_image-ff8eda543753598d-300x300.jpeg"
                },
                {
                    "name":"MuctuQ",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/muctuq-profile_image-9f743baf5ad20595-300x300.jpeg"
                },
                {
                    "name":"Reconnect_",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reconnect_-profile_image-936c3b2ca6b444b5-300x300.jpeg"
                },
                {
                    "name":"flinrr",
                    "luck":1,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"aBratF"
                    ,"luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/abratf-profile_image-ce4470cc66c23a30-300x300.jpeg"
                },
                {
                    "name":"sarcasm223",
                    "luck":3,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                },
                {
                    "name":"ReRuf",
                    "luck":3,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reruf-profile_image-ff8eda543753598d-300x300.jpeg"
                },
                {
                    "name":"MuctuQ",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/muctuq-profile_image-9f743baf5ad20595-300x300.jpeg"
                },
                {
                    "name":"Reconnect_",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reconnect_-profile_image-936c3b2ca6b444b5-300x300.jpeg"
                },
                {
                    "name":"flinrr",
                    "luck":1,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"aBratF"
                    ,"luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/abratf-profile_image-ce4470cc66c23a30-300x300.jpeg"
                },
                {
                    "name":"sarcasm223",
                    "luck":3,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                },
                {
                    "name":"ReRuf",
                    "luck":3,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reruf-profile_image-ff8eda543753598d-300x300.jpeg"
                },
                {
                    "name":"MuctuQ",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/muctuq-profile_image-9f743baf5ad20595-300x300.jpeg"
                },
                {
                    "name":"Reconnect_",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reconnect_-profile_image-936c3b2ca6b444b5-300x300.jpeg"
                },
                {
                    "name":"flinrr",
                    "luck":1,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"aBratF"
                    ,"luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/abratf-profile_image-ce4470cc66c23a30-300x300.jpeg"
                },
                {
                    "name":"sarcasm223",
                    "luck":3,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                },
                {
                    "name":"ReRuf",
                    "luck":3,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reruf-profile_image-ff8eda543753598d-300x300.jpeg"
                },
                {
                    "name":"MuctuQ",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/muctuq-profile_image-9f743baf5ad20595-300x300.jpeg"
                },
                {
                    "name":"Reconnect_",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reconnect_-profile_image-936c3b2ca6b444b5-300x300.jpeg"
                },
                {
                    "name":"flinrr",
                    "luck":1,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"aBratF"
                    ,"luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/abratf-profile_image-ce4470cc66c23a30-300x300.jpeg"
                },
                {
                    "name":"sarcasm223",
                    "luck":3,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                },
                {
                    "name":"ReRuf",
                    "luck":3,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reruf-profile_image-ff8eda543753598d-300x300.jpeg"
                },
                {
                    "name":"MuctuQ",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/muctuq-profile_image-9f743baf5ad20595-300x300.jpeg"
                },
                {
                    "name":"Reconnect_",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reconnect_-profile_image-936c3b2ca6b444b5-300x300.jpeg"
                },
                {
                    "name":"flinrr",
                    "luck":1,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"aBratF"
                    ,"luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/abratf-profile_image-ce4470cc66c23a30-300x300.jpeg"
                },
                {
                    "name":"sarcasm223",
                    "luck":3,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                },
                {
                    "name":"ReRuf",
                    "luck":3,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reruf-profile_image-ff8eda543753598d-300x300.jpeg"
                },
                {
                    "name":"MuctuQ",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/muctuq-profile_image-9f743baf5ad20595-300x300.jpeg"
                },
                {
                    "name":"Reconnect_",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reconnect_-profile_image-936c3b2ca6b444b5-300x300.jpeg"
                },
                {
                    "name":"flinrr",
                    "luck":1,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"aBratF"
                    ,"luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/abratf-profile_image-ce4470cc66c23a30-300x300.jpeg"
                },
                {
                    "name":"sarcasm223",
                    "luck":3,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                },
                {
                    "name":"ReRuf",
                    "luck":3,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reruf-profile_image-ff8eda543753598d-300x300.jpeg"
                },
                {
                    "name":"MuctuQ",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/muctuq-profile_image-9f743baf5ad20595-300x300.jpeg"
                },
                {
                    "name":"Reconnect_",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reconnect_-profile_image-936c3b2ca6b444b5-300x300.jpeg"
                },
                {
                    "name":"flinrr",
                    "luck":1,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"aBratF"
                    ,"luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/abratf-profile_image-ce4470cc66c23a30-300x300.jpeg"
                },
                {
                    "name":"sarcasm223",
                    "luck":3,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                },
                {
                    "name":"ReRuf",
                    "luck":3,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reruf-profile_image-ff8eda543753598d-300x300.jpeg"
                },
                {
                    "name":"MuctuQ",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/muctuq-profile_image-9f743baf5ad20595-300x300.jpeg"
                },
                {
                    "name":"Reconnect_",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reconnect_-profile_image-936c3b2ca6b444b5-300x300.jpeg"
                },
                {
                    "name":"flinrr",
                    "luck":1,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"aBratF"
                    ,"luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/abratf-profile_image-ce4470cc66c23a30-300x300.jpeg"
                },
                {
                    "name":"sarcasm223",
                    "luck":3,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                },
                {
                    "name":"ReRuf",
                    "luck":3,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reruf-profile_image-ff8eda543753598d-300x300.jpeg"
                },
                {
                    "name":"MuctuQ",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/muctuq-profile_image-9f743baf5ad20595-300x300.jpeg"
                },
                {
                    "name":"Reconnect_",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reconnect_-profile_image-936c3b2ca6b444b5-300x300.jpeg"
                },
                {
                    "name":"flinrr",
                    "luck":1,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"aBratF"
                    ,"luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/abratf-profile_image-ce4470cc66c23a30-300x300.jpeg"
                },
                {
                    "name":"sarcasm223",
                    "luck":3,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                },
                {
                    "name":"ReRuf",
                    "luck":3,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reruf-profile_image-ff8eda543753598d-300x300.jpeg"
                },
                {
                    "name":"MuctuQ",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/muctuq-profile_image-9f743baf5ad20595-300x300.jpeg"
                },
                {
                    "name":"Reconnect_",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reconnect_-profile_image-936c3b2ca6b444b5-300x300.jpeg"
                },
                {
                    "name":"flinrr",
                    "luck":1,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"aBratF"
                    ,"luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/abratf-profile_image-ce4470cc66c23a30-300x300.jpeg"
                },
                {
                    "name":"sarcasm223",
                    "luck":3,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                },
                {
                    "name":"ReRuf",
                    "luck":3,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reruf-profile_image-ff8eda543753598d-300x300.jpeg"
                },
                {
                    "name":"MuctuQ",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/muctuq-profile_image-9f743baf5ad20595-300x300.jpeg"
                },
                {
                    "name":"Reconnect_",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/reconnect_-profile_image-936c3b2ca6b444b5-300x300.jpeg"
                },
                {
                    "name":"flinrr",
                    "luck":1,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"aBratF"
                    ,"luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/abratf-profile_image-ce4470cc66c23a30-300x300.jpeg"
                },
                {
                    "name":"sarcasm223",
                    "luck":3,
                    "win":false,
                    "avatar":"null"
                },
                {
                    "name":"TRSNDC",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/trsndc-profile_image-96dcf4afcf042ddd-300x300.jpeg"
                },
                {
                    "name":"BearBilly",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/bearbilly-profile_image-7f7d345c28e81791-300x300.jpeg"
                },
                {
                    "name":"psychothrone3000",
                    "luck":1,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/psychothrone3000-profile_image-07d398dccfedc053-300x300.jpeg"
                },
                {
                    "name":"dashik_dolphin",
                    "luck":2,
                    "win":false,
                    "avatar":"https://static-cdn.jtvnw.net/jtv_user_pictures/dashik_dolphin-profile_image-656a72142a84adfa-300x300.jpeg"
                }
        ],
            min: 0,
            max: 2000
        };
        vm.randomOrgIframe = 'https://www.random.org/widgets/integers/iframe.php?buttontxt=Generate&width=160&height=200&border=on&bgcolor=%23FFFFFF&txtcolor=%23777777&altbgcolor=%23CCCCFF&alttxtcolor=%23000000&defaultmin='+vm.testData.min+'&defaultmax='+vm.testData.max+'&fixed=on';
        vm.randomOrgIframeSrc = $sce.trustAsResourceUrl(vm.randomOrgIframe);
        vm.defaultAvatar = '/src/img/avatars/avatar_default.jpg';

        $rootScope.raffleStart = undefined;

        vm.endRaffleProcess = endRaffleProcess;
        vm.startRaffle = startRaffle;
        vm.setWinnerNumber = setWinnerNumber;
        vm.loadMoreUsers = loadMoreUsers;
        vm.searchUserInUsersListName = searchUserInUsersListName;
        vm.searchUserInUsersListPosition = searchUserInUsersListPosition;
        vm.goRaffleProcessAgain = goRaffleProcessAgain;
        vm.replicateRaffle = replicateRaffle;

        activate();

        ////////////////

        function activate() {
            intercomService.on('raffleStart', setAnyCount);
        }

        // Запускаем сценарий розыгрыша. id - ID розыгрыша, в котором проводим розыгрыш
        function startRaffle() {
            vm.raffleStep1 = false;
            vm.raffleStep2 = true;
            getWinner(vm.raffleID, vm.testStatus);
        }

        // Рандомизация числа для определения победителя
        function setWinnerNumber() {
            var counter = 0;
            vm.waitingRandomNumber = true;
            var interval = setInterval(function(){
                console.log('ограничения по числам',vm.testData.min, vm.testData.max);
                vm.winnerNumber = getRandomArbitary(vm.testData.min, vm.testData.max);
                counter++;
                $scope.$apply();
                if (counter == 20) {
                    vm.waitingRandomNumber = false;
                    clearInterval(interval);
                    $scope.$apply();
                }
            },50);

        }


        /** Теориетически может работать, но должны совпадать протоколы HTTP и HTTPS у нас и Random.org
        /*
        $('#randomOrgFrame').on('load', function(){
            var iframe = $('#randomOrgFrame').contents();
            console.log(iframe);
            /*var button = iframe.find('#true-random-integer-generator-max').val;
            console.log(button);
        });

        $(document).ready(function(){
            var iframe = $('#randomOrgFrame').contents();
            var button = iframe.find('#true-random-integer-generator-max').value;
            console.log(button);
            iframe.on("click",function(){
                console.log('Нажал кнопку рандома');
                /*var iframe = $('#randomOrgFrame').contents();
                 var button = iframe.find('true-random-integer-generator-button');
                 var fgfdgd = iframe.find('#true-random-integer-generator-result').html();
                 console.log(fgfdgd);
            });
        })



        $('#true-random-integer-generator-button').click(function(){
            console.log('Нажал кнопку рандома');
            //vm.winnerNumber = $('#true-random-integer-generator-result').text().toString();
        });*/

        /**
         * Определение начальной среды для отображения процесса розыгрыша
         * @obj data - данные для формирования розыгрыша:
         * ------------------------------
         * @string id - ID64 конкурса, в котором запустили процесс розыгрыша
         * @bool test - состояние отладки
         * @ing max - максимальный уровень лака в розыгрыше
         * @string type - тип процедуры розыгрыша - простой / подробный
         * ------------------------------
         */
        function setAnyCount(data) {
            if (!document.hidden) {
                // Проверка видимости текущего таба. Функция отработает только в активной вкладке
                document.getElementById('MusicReady').play();
                document.getElementById('MusicReady').volume = 0.2;
                // Тестовый метод проверки розыгрыша
                if (data.test) {
                    vm.testData.max = 2000;
                } else {
                    vm.testData.max = data.max;
                }

                vm.raffleID = data.id;
                vm.testStatus = data.test;
                vm.processType = data.type;
                $rootScope.raffleStart = true;

                // Проверка типа начатого розыгрыша
                if (data.type === 'simple') {
                    console.log('простой сценарий', data);
                    vm.winnerNumber = getRandomArbitary(1, data.max);
                    startRaffle();
                } else if (data.type === 'full') {
                    vm.showSelectNumberWindow = true;
                    vm.usersListPage = -1;
                    vm.usersListPerPage = 500;
                    vm.raffleStep1 = true;
                }
            }
        }

        function goRaffleProcessAgain() {
            vm.winners = undefined;
            vm.step1 = 3000;
            vm.raffleStep1 = false;
            vm.raffleStep2 = false;
            vm.raffleStep3 = false;
            vm.raffleStep4 = false;
            vm.cardLeft = 100;
            vm.okButton = false;
            vm.winnerNumberHide = false;
            vm.usersListVisible = false;
            vm.waitingRandomNumber = false;
            vm.winnerNumber = 0;
            vm.usersList = [];
            vm.flippedarray = [];
            var againData = {
                id: vm.raffleID,
                test: vm.testStatus,
                max: vm.testData.max,
                type: vm.processType
            };
            setAnyCount(againData);
        }


        /*var data = {
            id: vm.gaData.id,
            test: false,
            max: vm.gaData.stats.summLuck,
            type: type
        };
        Intercom.getInstance().emit('raffleStart', data);*/


        // Загрузка и подгрузка списка учатсников
        function loadMoreUsers(){
            vm.usersListPage++;
            var postUrl = '/api/raffle/' + vm.raffleID + '/list?page=' + vm.usersListPage + '&perPage=' + vm.usersListPerPage;
            var data = {};
            $http.post(postUrl, data)
                .then(function(response){
                    response.data.data.partipiant.forEach(function(f){
                        vm.usersList.push(f);
                    });
                })
        }

        // Поиск пользователя по имени
        function searchUserInUsersListName(name){
            vm.searchUserByPosition = undefined;
            var postUrl;
            var data = {};
            vm.usersListVisible = true;
            vm.waiter = true;
            if (vm.searchUserByName.length > 0) {
                vm.usersList = [];
                postUrl = '/api/raffle/' + vm.raffleID + '/list?page=0&perPage=10&name=' + name;
                $http.post(postUrl, data)
                    .then(function(response){
                        vm.waiter = false;
                        response.data.data.partipiant.forEach(function(f){
                            vm.usersList.push(f);
                        });
                    })
            } else {
                vm.usersList = [];
                postUrl = '/api/raffle/' + vm.raffleID + '/list?page=0&perPage=' + vm.usersListPerPage;
                $http.post(postUrl, data)
                    .then(function(response){
                        vm.waiter = false;
                        response.data.data.partipiant.forEach(function(f){
                            vm.usersList.push(f);
                        });
                    })
            }
        }

        // Поиск пользователя по выигрышному числу
        function searchUserInUsersListPosition(position){
            vm.searchUserByName = undefined;
            var postUrl;
            var data = {};
            vm.usersListVisible= true;
            vm.waiter = true;
            if (vm.searchUserByPosition.length > 0) {
                postUrl = '/api/raffle/' + vm.raffleID + '/list?page=0&perPage=10&position=' + position;
                $http.post(postUrl, data)
                    .then(function(response){
                        vm.usersList = [];
                        response.data.data.partipiant.forEach(function(f){
                            vm.usersList.push(f);
                        });
                    })
            } else {
                postUrl = '/api/raffle/' + vm.raffleID + '/list?page=0&perPage=' + vm.usersListPerPage;
                $http.post(postUrl, data)
                    .then(function(response){
                        vm.usersList = [];
                        response.data.data.partipiant.forEach(function(f){
                            vm.usersList.push(f);
                        });
                    })
            }
        }

        // Получаем инфу о призерах
        function getWinner(id, test) {
            console.log('Начинаю розыгрыш...');
            var data = {
                random: vm.winnerNumber,
                limit: 136
            };
            var postUrl;
            var pushData = {
                scopeToggle: false
            };
            if (test === true) {
                vm.winners = vm.testData.data;
                vm.cardCounter = vm.winners.length;
                vm.winners.forEach(function(f) {
                    if (f.win == true) {
                        vm.winner = f;
                    }
                });
                vm.cardLeft = vm.winners.length;
                for (var i = 0; i < vm.cardCounter; i++) {
                    vm.flippedarray.push(pushData)
                }
                shuffle(vm.winners);
                reCount();
            } else {
                postUrl = 'api/raffle/' + id + '/play';
                $http.post(postUrl, data)
                    .then(function(response){
                        vm.winners = response.data.data.winnerInfo;
                        vm.cardCounter = vm.winners.length;
                        vm.processCount = response.data.data.remaining;
                        console.log('vm.processCount', vm.processCount);
                        vm.winners.forEach(function(f) {
                            if (f.win == true) {
                                vm.winner = f;
                            }
                        });
                        vm.cardLeft = vm.winners.length;
                        for (var i = 0; i < vm.cardCounter; i++) {
                            vm.flippedarray.push(pushData)
                        }
                    })
                    .then(function() {
                        shuffle(vm.winners);
                    })
                    .then(reCount())
                    .catch(function(response){
                        console.log('Ошибка получения победителей',response.data);
                    })
            }
        }

        // Рандомизация массива пользователей.
        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }

        // Переход на вторую стадию розыгрыша
        function reCount() {
             var checkOK = setTimeout(function() {
                console.log('итерация');
                if (vm.winners) {
                    vm.raffleStep2 = false;
                    vm.raffleStep3 = true;
                    $scope.$apply();
                    cardShaker();
                    clearTimeout(checkOK);
                } else {
                    reCount();
                }
            }, 1000)
        }

        // Третий шаг розыгрыша
        function step3() {
            console.log('step3');
            vm.raffleStep4 = true;
            vm.raffleStep2 = false;
            vm.raffleStep3 = false;
            vm.okButton = true;
        }

        /**
         * Вот тут указываем время ожидания переворота следующей карточки
         */
        // Скрытие карт
        function cardShaker() {
            vm.shaker = $interval(function() {
                countCards();
            },50);
        }

        // Рандомайзер
        function getRandomArbitary(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }

        // Добавление класса для выбранных карт
        function countCards() {
            if (vm.cardLeft == 1) {
                $interval.cancel(vm.shaker);
                step3();
            }
            var cardOff = getRandomArbitary(0,vm.cardCounter);
            if (vm.winners[cardOff] && vm.flippedarray[cardOff]) {
                if (vm.winners[cardOff].win === false && vm.flippedarray[cardOff].scopeToggle === false) {
                    vm.flippedarray[cardOff] = {scopeToggle: true};
                    vm.cardLeft--;
                } else {
                    countCards();
                }
            }
        }

        /**
         * Завершение процесса розыгрыша и переход в визард
         */
        function endRaffleProcess() {
            console.log('endRaffleProcess');
            $rootScope.raffleStart = false;
            vm.showSelectNumberWindow = false;
            vm.raffleStep2 = false;
            vm.raffleStep3 = false;
            vm.raffleStep4 = false;
            $location.url('/wizard');
        }

        /**
         * Пересоздание розыгрыша, нажатие на кнопку "Повторить розыгрыш"
         */
        function replicateRaffle() {
            console.log('endRaffleProcess');
            $rootScope.raffleStart = false;
            $rootScope.itIsMyFirstRaffle = false;
            vm.showSelectNumberWindow = false;
            vm.raffleStep2 = false;
            vm.raffleStep3 = false;
            vm.raffleStep4 = false;
            $http.post('/api/raffle/replicate',{})
                .then(function(response) {
                    var locationUrl = '/'+ response.data.link;
                    $location.url(locationUrl);
                })
        }

    }
})();