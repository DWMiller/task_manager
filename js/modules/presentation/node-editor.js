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
            'node-label': document.getElementById('node-label'),
            'node-description': document.getElementById('node-description'),
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
    }

    function unbindEvents() {
        c.dom.ignore(elements['node-createChild'], 'click', createChildNode);
        c.dom.ignore(elements['node-label'], 'change', updateNode);
        c.dom.ignore(elements['node-description'], 'change', updateNode);
    }

    /******************************* Framework Listeners **********************/
    function nodeSelected(treeNode) {
        selectedNode = treeNode;
        updateEditor();
    }

    /************************************ GENERAL FUNCTIONS ************************************/

    function updateNode() {
        selectedNode.data.label = elements['node-label'].value;
        selectedNode.data.description = elements['node-description'].value;

        c.notify({
            type: 'node-edited',
            data: selectedNode
        });

        c.notify({
            type: 'data-changed',
            data: true
        });
    }

    function updateEditor() {
        elements['node-label'].value = selectedNode.data.label;
        elements['node-description'].value = selectedNode.data.description;
    }

    function createChildNode() {
        var node = new dmf.classes.TreeNode(c.data.project.projectTree);
        node.data.label = 'child of ' + selectedNode.data.label;
        node.data.description = 'No description';

        selectedNode.addChild(node);

        c.notify({
            type: 'node-created',
            data: {
                node: node,
                parent: selectedNode
            }
        });

        c.notify({
            type: 'data-changed',
            data: true
        });
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
