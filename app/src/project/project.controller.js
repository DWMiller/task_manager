(function () {
    "use strict";
    angular.module('task-manager').controller("projectController",
        ['projects', '$state', 'projectNode', projectController]);

    function projectController(projects, $state, projectNode) {
        let project = this;
        project.state = {};

        project.data = projects.getProject($state.params.projectId);

        var elements = {};

        function initialize() {
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