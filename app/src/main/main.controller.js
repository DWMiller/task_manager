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
            projects.saveProject(project);

            $state.go("project", {
                projectId: project.id
            });
        }
    }
})();