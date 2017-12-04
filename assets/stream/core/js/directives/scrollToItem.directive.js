(function() {
    'use strict';

    angular
        .module('streampub')
        .directive('scrollToItem', function () {
            return {
                restrict: 'A',
                scope: {
                    scrollTo: "@"
                },
                link: function (scope, $elm) {
                    $elm.on('click', function () {
                        console.log('мотаю');
                        $('html,body').animate({scrollTop: $(scope.scrollTo).offset().top}, "fast");
                    });
                }
            }
        });
})();