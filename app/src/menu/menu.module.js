(function() {
    "use strict";
    angular.module("tm-menu", [])
        .directive("menu", function() {
            return {
                restrict: 'E',
                controller: 'menuController as menu',
                bindToController: true,
                replace: true,
                templateUrl: "src/menu/menu.template.html",
                link: function($scope, element, attrs, controller) {
                }
            }
        });
})();

