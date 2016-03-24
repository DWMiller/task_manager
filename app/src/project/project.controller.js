(function () {
    "use strict";
    angular.module('task-manager').controller("projectController",
        ['$scope', 'projects', '$state', 'projectNode', projectController]);

    function projectController($scope, projects, $state, projectNode) {

        let project = this;

        project.state = {
            nodeSelected: null
        };

        project.data = projects.getProject($state.params.projectId);

        var elements = {};

        function initialize() {

            $scope.$on('node-moved', function (event, args) {
                projects.saveProject(project.data);
            });

            $scope.$on('node-deleted', function (event, args) {
                projects.saveProject(project.data);
            });

            $scope.$on('node-created', function (event, args) {
                projects.saveProject(project.data);
            });

            $scope.$on('node-edited', function (event, args) {
                projects.saveProject(project.data);
            });

        }

        // function nodeCreated(data) {
        //     addGraphNode(data.node, data.parent);
        //     elements.$viewer.trigger('node-clicked', data.node.graphNode);
        // }

        // function nodeEdited(node) {
        //     node.graphNode.data.label = node.data.label;
        //     node.graphNode.data.description = node.data.description;
        // }

        // function nodeDeleted(node) {
        //     // console.log('Deleting', node);
        //     // for (var i = 0; i < node.children.length; i++) {
        //     //     nodeDeleted(node.children[i]);
        //     // }
        //
        //     graph.removeNode(node.graphNode);
        // }

        // function nodeMoved(data) {
        //     nodeDeleted(data.node);
        //     nodeCreated(data);
        //     // update springy parent
        // }

        initialize();
    }

})
();