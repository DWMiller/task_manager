(function () {
    "use strict";
    angular.module("tm-menu")
        .directive("menuToggle", function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: "src/menu-toggle/menu-toggle.template.html",
                scope: {
                    menuOpen: '=open'
                }
            }
        });
})();

