(function() {
    "use strict";
    angular.module('tm-viewer').controller("viewerController",
        ['$rootScope', 'renderer', 'projectNode', '$element', viewerController]);

    function viewerController($rootScope, renderer, projectNode, $element) {
        let viewer = this;

        var graph;

        function initialize() {
            populateGraph();

            $element[0].addEventListener('mousedown', function(event) {
                renderer.handlers.mousedown(event);
            });

            $element[0].addEventListener('mousemove', function(event) {
                renderer.handlers.mousemove(event);
            });

            $element[0].addEventListener('mouseup', function(event) {
                renderer.handlers.mouseup(event);
            });

            $element[0].addEventListener('dblclick', function(event) {
                renderer.handlers.dblclick(event);
            });

            renderer.start({
                    canvas: $element,
                    graph: graph,
                    project: viewer.project,
                    callbacks: eventHandlers
                }
            );

        }

        function populateGraph() {
            graph = new Springy.Graph();

            //Fake node so multiple root nodes have a common source
            let rootNode = projectNode({
                children: viewer.project.tree,
                label: 'Fake Render Core Node'
            });

            projectNode.traverseNode(rootNode, addGraphNode, rootNode);
        }


        function addGraphNode(node, parent) {
            //TODO - Shouldn't need to save graph node reference to node
            // Currently needed to maintain relation from parent to child
            // Should sort out functions so parent graph node is passed for that purpose
            node.graphNode = graph.newNode({
                label: node.label,
                treeNode: node
            });

            if (parent !== node) {
                graph.newEdge(parent.graphNode, node.graphNode, {
                    color: '#00A0B0'
                });
            }
        }

        let eventHandlers = {
            nodeSelected: function(node) {
                $rootScope.$broadcast('node-selected', {node: node});
                console.log(node);
            },
            nodeDoubleClicked: function(node) {

            }

        };


        initialize();
    }

})();