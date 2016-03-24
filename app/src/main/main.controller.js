(function () {
    "use strict";
    angular.module('task-manager').controller("mainController", ['projects',
        '$state', mainController]);

    function mainController(projects, $state) {

        let main = this;

        main.state = {
            menuOpened: false
        };
    }
})();