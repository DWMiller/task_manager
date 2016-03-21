var appManager = angular.module("task-manager", ['tm-menu', 'tm-node-editor',
    'tm-projects', 'tm-viewer', 'ui.router']);

(function(app) {
    app.run(['$rootScope', '$state', run]);

    function run($rootScope, $state) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
            console.log('state change to ' + toState.name);
        });
    }
})(appManager);
