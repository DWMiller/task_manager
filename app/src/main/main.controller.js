(function() {
    "use strict";
    angular.module('task-manager').controller("mainController", [mainController]);

    function mainController() {

        let main = this;

        main.state = {
            menuOpened: false
        };


    }
})();