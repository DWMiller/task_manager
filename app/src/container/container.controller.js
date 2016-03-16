(function() {
    "use strict";
    angular.module('task-manager').controller("containerController", [containerController]);

    function containerController() {

        let container = this;

        container.state = {
            menuOpened: false
        };

    }
})();