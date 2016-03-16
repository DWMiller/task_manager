(function() {
    "use strict";
    angular.module('task-manager').controller("projectController",
        ['projects', '$state', 'renderer', projectController]);

    function projectController(projects, $state, renderer) {
        let project = this;
        project.state = {};

        project.data = projects.getProject($state.params.projectId);

        var elements = {},
            graph, $springy;

        elements.canvas = document.getElementById('viewer');
        elements.$viewer = $(elements.canvas);
        elements.version = document.getElementById('version');

        console.log(project.data);

        setCanvasSize();

        window.onresize = function() {
            c.notify('graph-unready');
            setCanvasSize();
            renderGraph();
        };

        function setCanvasSize() {

            elements.canvas.width = elements.$viewer.parent().width();
            elements.canvas.height = elements.$viewer.parent().height();
        }

        function wipeGraph() {
            c.notify('graph-unready');
            if (graph) {
                graph.empty();
            }
        }

        function populateGraph() {
            graph = new Springy.Graph();


            //var rootNode = c.data.project.projectTree.rootNode;
            //c.data.project.projectTree.traverseNode(rootNode, addGraphNode, rootNode);
        }

        function renderGraph() {
            renderer.start(
                {
                    graph: graph,
                    project: project.data,
                }
            );
        }

        function addGraphNode(node, parent) {
            node.graphNode = graph.newNode({
                label: node.data.label,
                treeNode: node
            });

            if (parent !== node) {
                graph.newEdge(parent.graphNode, node.graphNode, {
                    color: '#00A0B0'
                });
            }
        }

        function projectOpened() {
            wipeGraph();
            populateGraph();
            renderGraph();
        }

        function nodeCreated(data) {
            addGraphNode(data.node, data.parent);
            elements.$viewer.trigger('node-clicked', data.node.graphNode);
        }

        function nodeEdited(node) {
            node.graphNode.data.label = node.data.label;
            node.graphNode.data.description = node.data.description;
        }

        function nodeDeleted(node) {
            // console.log('Deleting', node);
            // for (var i = 0; i < node.children.length; i++) {
            //     nodeDeleted(node.children[i]);
            // }

            graph.removeNode(node.graphNode);
        }

        function nodeMoved(data) {
            nodeDeleted(data.node);
            nodeCreated(data);
            // update springy parent
        }

    }

})();