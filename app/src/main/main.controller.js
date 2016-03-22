(function() {
    "use strict";
    angular.module('task-manager').controller("mainController", ['projects',
        '$state', mainController]);

    function mainController(projects, $state) {

        let main = this;

        main.state = {
            menuOpened: false
        };

        main.createProjectClick = function() {
            //localStorage.clear() // fuck persistant data for the moment
            let project = projects.createProject();
            //TODO - this project won't be visible in menu load list, need to tell menu project has been created
            // menu.data.projects[project.id] = project;

            $state.go("project", {
                projectId: project.id
            });
        }
    }
})();