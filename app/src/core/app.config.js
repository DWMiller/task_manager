(function(app) {
    angular.module('task-manager').config(['$stateProvider', '$urlRouterProvider',
        '$locationProvider', config
    ]);

    function config($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise("/");

        //Think will make urls prettier, but need to enable server side url rewriting
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });

        $stateProvider.state("default", {
            url: "/",
            templateUrl: "src/main/main.template.html",
            controller: "mainController as main"
        });

        $stateProvider.state("project", {
            url: "/project/:projectId",
            templateUrl: "src/project/project.template.html",
            controller: "projectController as project"
        });

    }
})(appManager);
