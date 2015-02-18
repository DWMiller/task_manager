dmf.createModule('node-editor', function(c) {
    'use strict';

    var p_properties = {
        id: 'node-editor',
        selector: 'node-editor',
        listeners: {
            'node-selected': nodeSelected
        }
    };

    var elements = {},
        selectedNode;

    /************************************ MODULE INITIALIZATION ************************************/

    function p_initialize(scope) {
        elements = {
            'node-data': document.getElementById('node-data'),
            'node-commands': document.getElementById('node-commands'),
            'node-createChild': document.getElementById('node-createChild'),
            'node-delete': document.getElementById('node-delete'),
            'node-label': document.getElementById('node-label'),
            'node-description': document.getElementById('node-description'),
            'node-status': document.getElementById('node-status'),
            'node-importance': document.getElementById('node-importance'),
        };
        bindEvents();
    }

    function p_destroy() {
        unbindEvents();
        elements = null;
    }

    function bindEvents() {
        c.dom.listen(elements['node-createChild'], 'click', createChildNode);
        c.dom.listen(elements['node-label'], 'change', updateNode);
        c.dom.listen(elements['node-description'], 'change', updateNode);
        c.dom.listen(elements['node-status'], 'change', updateNode);
        c.dom.listen(elements['node-delete'], 'click', deleteNode);
        c.dom.listen(elements['node-importance'], 'change', updateNode);
    }

    function unbindEvents() {
        c.dom.ignore(elements['node-createChild'], 'click', createChildNode);
        c.dom.ignore(elements['node-label'], 'change', updateNode);
        c.dom.ignore(elements['node-description'], 'change', updateNode);
        c.dom.ignore(elements['node-status'], 'change', updateNode);
        c.dom.ignore(elements['node-delete'], 'click', deleteNode);
        c.dom.ignore(elements['node-importance'], 'change', updateNode);
    }

    /******************************* Framework Listeners **********************/
    function nodeSelected(treeNode) {
        //trigger a save before changing the editor panel content
        if (selectedNode) {
            updateNode();
        }

        selectedNode = treeNode;
        updateEditor();
        elements['node-label'].focus();
        elements['node-label'].select();
    }

    /************************************ GENERAL FUNCTIONS ************************************/

    function deleteNode() {
        var rootNode = c.data.project.projectTree.rootNode;
        c.data.project.projectTree.traverseNode(rootNode, deleteNodeFromParent, rootNode);

        c.notify({
            type: 'node-deleted',
            data: selectedNode
        });

        c.notify('data-changed');
    }

    /**
     * [deleteMatchedChild description]
     * @return {[type]} [description]
     */
    function deleteNodeFromParent(node, parent) {
        //use indexof?
        if (node.data === selectedNode.data) {
            parent.children.forEach(function(n, i) {
                if (selectedNode.data === n.data) {
                    parent.children.splice(i, 1);
                }
            });
        }
    }

    function updateNode() {
        selectedNode.data.label = elements['node-label'].value;
        selectedNode.data.description = elements['node-description'].value;
        selectedNode.data.status = elements['node-status'].value;
        selectedNode.data.importance = elements['node-importance'].value;

        c.notify({
            type: 'node-edited',
            data: selectedNode
        });

        c.notify('data-changed');
    }

    function updateEditor() {
        elements['node-label'].value = selectedNode.data.label;
        elements['node-description'].value = selectedNode.data.description;
        elements['node-status'].value = selectedNode.data.status;
        elements['node-importance'].value = selectedNode.data.importance || 1;
    }

    function createChildNode() {
        var node = new dmf.classes.TreeNode(c.data.project.projectTree);
        node.data.label = 'child of ' + selectedNode.data.label;
        node.data.description = 'No description';
        node.data.status = 'incomplete';
        node.data.importance = 1;

        selectedNode.addChild(node);

        c.notify({
            type: 'node-created',
            data: {
                node: node,
                parent: selectedNode
            }
        });

        c.notify('data-changed');
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
