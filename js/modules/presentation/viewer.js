dmf.createModule('viewer', function(c) {
    'use strict';

    var properties = {
        id: 'viewer',
        selector: 'viewer',
        listeners: {
            'project-opened': projectOpened,
            'node-created': nodeCreated,
            'node-edited': nodeEdited,
            'node-deleted': nodeDeleted,
        }
    };

    var elements = {},
        graph, $springy;

    /************************************ MODULE INITIALIZATION ************************************/

    function initialize(scope) {
        elements.$viewer = $(scope.self());

        scope.self().width = elements.$viewer.parent().width();
        scope.self().height = elements.$viewer.parent().height();

        bindEvents();
        c.startModule('renderer');
    }

    function destroy() {
        unbindEvents();
        elements = null;
        c.stopModule('renderer');
    }

    function bindEvents() {
        // c.dom.listen(elements['menu-toggle'], 'click', toggleMenu);
    }

    function unbindEvents() {
        // c.dom.ignore(elements['menu-toggle'], 'click', toggleMenu);
    }

    /******************************* Framework Listeners **********************/
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

    /************************************ GENERAL FUNCTIONS ************************************/

    function wipeGraph() {
        c.notify('graph-unready');
        if (graph) {
            graph.empty();
        }
    }

    function populateGraph() {
        graph = new Springy.Graph();
        var rootNode = c.data.project.projectTree.rootNode;
        c.data.project.projectTree.traverseNode(rootNode, addGraphNode, rootNode);
    }

    function renderGraph() {
        c.notify({
            type: 'graph-ready',
            data: {
                graph: graph,
            }
        });
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

    return {
        properties: properties,
        initialize: initialize,
        destroy: destroy,
    };

});
