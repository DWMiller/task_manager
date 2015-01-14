CORE.createModule('viewer', function(c) {
    'use strict';

    var properties = {
        id: 'viewer',
        selector: 'viewer',
        listeners: {
            'project-opened': projectOpened,
            'node-created': nodeCreated,
            'node-edited': nodeEdited
        }
    };

    var elements = {},
        graph;

    /************************************ MODULE INITIALIZATION ************************************/

    function initialize(scope) {
        elements = {
            $viewer: $(scope.self())
        };

        scope.self().width = elements.$viewer.parent().width();
        scope.self().height = elements.$viewer.parent().height();

        bindEvents();
    }

    function destroy() {
        unbindEvents();
        elements = null;
    }

    function bindEvents() {
        // c.dom.listen(elements['menu-toggle'], 'click', toggleMenu);
    }

    function unbindEvents() {
        // c.dom.ignore(elements['menu-toggle'], 'click', toggleMenu);
    }

    /******************************* Framework Listeners **********************/
    function projectOpened() {
        if (graph) {
            graph.empty();
        } else {
            graph = new Springy.Graph();
        }

        populateGraph();

        var springy = window.springy = $('#viewer').springy({
            graph: graph,
            nodeSelected: nodeSelected
        });

    }

    function nodeCreated(data) {
        addGraphNode(data.node, data.parent);
    }

    function nodeEdited(node) {
        node.graphNode.data.label = node.data.label;
        node.graphNode.data.description = node.data.description;
    }    

    /************************************ GENERAL FUNCTIONS ************************************/

    function populateGraph() {
        var rootNode = c.data.project.projectTree.rootNode;

        c.data.project.projectTree.traverseNode(rootNode, addGraphNode, rootNode);

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

    function nodeSelected(node) {
        c.notify({
            type: 'node-selected',
            data: node.data.treeNode
        });
    }

    return {
        properties: properties,
        initialize: initialize,
        destroy: destroy,
    };

});
