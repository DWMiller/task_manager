(function () {
    "use strict";
    angular.module('tm-viewer').controller("viewerController",
        ['$rootScope', '$scope', 'renderer', 'projectNode', '$element',
            viewerController]);

    function viewerController($rootScope, $scope, renderer, projectNode, $element) {
        let viewer = this;

        var graph;

        function initialize() {

            $scope.$on('$destroy', function () {
                renderer.stop();
            });

            populateGraph();

            $element[0].addEventListener('mousedown', function (event) {
                renderer.handlers.mousedown(event);
            });

            $element[0].addEventListener('mousemove', function (event) {
                renderer.handlers.mousemove(event);
            });

            $element[0].addEventListener('mouseup', function (event) {
                renderer.handlers.mouseup(event);
            });

            $element[0].addEventListener('dblclick', function (event) {
                renderer.handlers.dblclick(event);
            });

            renderer.start({
                    canvas: $element,
                    graph: graph,
                    project: viewer.project,
                    callbacks: eventHandlers
                }
            );

            $scope.$on('node-moved', function (event, args) {
                graph.removeEdge(args.node.graphParentEdge); //removes connection to children
                addGraphEdge(args.node, args.parent);
            });

            $scope.$on('node-deleted', function (event, args) {
                graph.removeNode(args.node.graphNode);
            });

            $scope.$on('node-created', function (event, args) {
                addGraphNode(args.node, args.parent);
                addGraphEdge(args.node, args.parent);
            });

            $scope.$on('node-edited', function (event, args) {
                //TODO build an automatic system to remap node data to graph data
                args.node.graphNode.data.label = args.node.label;
                console.log(args.node);
            });


        }

        function populateGraph() {
            graph = new Springy.Graph();

            //Fake node so multiple root nodes have a common source

            let rootNode = viewer.project.tree[0];

            if (viewer.project.tree.length > 1) {
                rootNode = projectNode({
                    children: viewer.project.tree,
                    label: 'Fake Render Core Node',
                    cloned: true
                });
            }

            projectNode.traverseNode(rootNode, addGraphNode, rootNode);
            projectNode.traverseNode(rootNode, addGraphEdge, rootNode);
        }


        function addGraphNode(node, parent) {
            node.parent = parent;
            //TODO - Shouldn't need to save graph node reference to node
            // Currently needed to maintain relation from parent to child
            // Should sort out functions so parent graph node is passed for that purpose
            node.graphNode = graph.newNode({
                label: node.label,
                treeNode: node
            });
        }

        function addGraphEdge(node, parent) {
            if (parent !== node) {
                node.graphParentEdge = graph.newEdge(parent.graphNode, node.graphNode, {
                    color: '#00A0B0'
                });
            }
        }

        let eventHandlers = {
            nodeSelected: function (node) {
                $rootScope.$broadcast('node-selected', {node: node});
            },
            nodeDoubleClicked: function (node) {

            }

        };


        initialize();
    }

})();