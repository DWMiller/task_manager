(function() {
    "use strict";
    angular.module("tm-viewer", [])
        .directive("viewer", function() {
            return {
                restrict: 'E',
                controller: 'viewerController as viewer',
                bindToController: true,
                replace: true,
                templateUrl: "src/viewer/viewer.template.html",
                scope: {
                    project: '=project'
                },
                link: function($scope, element, attrs, controller) {
                    element[0].width = $(element).parent().width();
                    element[0].height = $(element).parent().height();
                }
            }
        });
})();

    
    
