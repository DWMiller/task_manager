(function() {
    "use strict";
    angular.module("tm-node-editor", [])
        .directive("nodeEditor", function() {
            return {
                restrict: 'E',
                controller: 'nodeEditorController as nodeEditor',
                bindToController: true,
                replace: true,
                templateUrl: "src/node-editor/node-editor.template.html",
                link: function($scope, element, attrs, controller) {
                }
            }
        });
})();

