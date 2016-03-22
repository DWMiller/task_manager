(function() {
    "use strict";
    angular.module('tm-menu').controller("menuController", ['$state', 'projects',
        menuController]);

    function menuController($state, projects) {

        let menu = this;

        menu.data = {
            projects: projects.getAllProjects()
        };

        menu.projectCreateClick = function() {
            let project = projects.createProject();
            menu.data.projects[project.id] = project;

            $state.go("project", {
                projectId: project.id
            });

        };

        // menu.projectImport = function(e) {
        //     var fileList = e.target.files;
        //     var file = fileList[0];
        //
        //     var reader = new FileReader();
        //     reader.onload = function(f) {
        //         parseFile(f.target.result);
        //     };
        //
        //     reader.readAsText(file);
        // };

        // function parseFile(jsonFile) {
        //     var project = JSON.parse(jsonFile);
        //     var projectId = project.projectId;
        //     localStorage.setItem(projectId, JSON.stringify(project));
        //
        //     c.notify('project-imported');
        // }

        // menu.projectExport = function() {
        //     var projectId = c.data.project.projectId;
        //     var projectName = c.data.project.projectName;
        //     download(projectName + '.json', localStorage.getItem(projectId));
        // };

        // function download(filename, text) {
        //     var pom = document.createElement('a');
        //     pom.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
        //     pom.setAttribute('download', filename);
        //     pom.click();
        //     pom.parentNode.removeChild(pom);
        // }
    }
})();