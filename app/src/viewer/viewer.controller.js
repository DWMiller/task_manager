(function() {
    "use strict";
    angular.module('tm-viewer').controller("viewerController",
        ['renderer', 'projectNode', '$element', viewerController]);

    function viewerController(renderer, projectNode, $element) {
        let viewer = this;

        var graph;

        function initialize() {
            wipeGraph();
            populateGraph();
            renderGraph();
        }

        function wipeGraph() {
            if (graph) {
                graph.empty();
            }
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

        function renderGraph() {
            renderer.start(
                {
                    canvas: $element,
                    graph: graph,
                    project: viewer.project
                }
            );
        }

        initialize();
    }

})();