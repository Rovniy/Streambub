(function() {
    'use strict';

    angular
        .module('streampub')
        .directive('starRating', starRating);

    starRating.$inject = [];

    function starRating() {
        return {
            restrict: 'EA',
            template:
            '<ul class="star-rating" ng-class="{readonly: readonly}">' +
            '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
            '    <i ng-if="!star.filled" class="fa fa-star-o"></i>' +
            '    <i ng-if="star.filled" class="fa fa-star"></i>' +
            '  </li>' +
            '</ul>',
            scope: {
                ratingValue: '=ngModel',
                max: '=?',
                onRatingSelect: '&?',
                readonly: '=?'
            },
            link: function(scope, element, attributes) {
                scope.max = 5;
                function updateStars() {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i < scope.ratingValue
                        });
                    }
                }
                scope.toggle = function(index) {
                    if (scope.readonly == undefined || scope.readonly === false){
                        scope.ratingValue = index + 1;
                        scope.onRatingSelect({
                            rating: index + 1
                        });
                    }
                };
                scope.$watch('ratingValue', function(oldValue, newValue) {
                    if (newValue) {
                        updateStars();
                    }
                });
            }
        };
    }
})();
