dmf.registerModule('viewer', function(c) {
    'use strict';

    var elements = {},
        graph, $springy;

    /************************************ MODULE INITIALIZATION ************************************/

    function initialize() {
        elements.canvas = document.getElementById('viewer');
        elements.$viewer = $(elements.canvas);
        elements.version = document.getElementById('version');
        version.innerHTML = dmf.config.globals.version;

        setCanvasSize();

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
        window.onresize = function() {
            c.notify('graph-unready');
            setCanvasSize();
            renderGraph();
        };

    }

    function unbindEvents() {
        // c.dom.ignore(elements['menu-toggle'], 'click', toggleMenu);
        window.onresize = null;
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

    function nodeMoved(data) {
        nodeDeleted(data.node);
        nodeCreated(data);
        // update springy parent
    }

    /************************************ GENERAL FUNCTIONS ************************************/

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
        listeners: {
            'project-opened': projectOpened,
            'node-created': nodeCreated,
            'node-edited': nodeEdited,
            'node-deleted': nodeDeleted,
            'node-moved': nodeMoved
        },
        start: initialize,
        stop: destroy,
    };

});
