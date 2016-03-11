dmf.registerModule('node-editor', function (c) {
    'use strict';

    var elements = {},
        selectedNode;

    var state = {
        parentSelectionMode: false
    };

    /************************************ MODULE INITIALIZATION ************************************/

    function initialize() {
        elements = {
            'editor': document.getElementById('node-editor'),
            'hide': document.getElementById('editor-hide'),
            'node-data': document.getElementById('node-data'),
            'node-commands': document.getElementById('node-commands'),
            'node-createChild': document.getElementById('node-createChild'),
            'node-delete': document.getElementById('node-delete'),
            'node-move': document.getElementById('node-move'),
            'node-label': document.getElementById('node-label'),
            'node-description': new Quill('#node-description--editor', {
                theme: 'snow'
            }),

            'node-status': document.getElementById('node-status'),
            'node-importance': document.getElementById('node-importance'),
        };

        elements['node-description'].addModule('toolbar', {
            container: '#node-description--toolbar'
        });

        bindEvents();
    }

    function destroy() {
        unbindEvents();
        elements = null;
    }

    function bindEvents() {
        c.dom.listen(elements['node-createChild'], 'click', createChildNode);
        c.dom.listen(elements['node-data'], 'change', updateNode);
        c.dom.listen(elements['node-delete'], 'click', deleteNode);
        c.dom.listen(elements['node-move'], 'click', startParentSelectionMode);
        c.dom.listen(elements.hide, 'click', hideEditor);
    }

    function unbindEvents() {
        c.dom.ignore(elements['node-createChild'], 'click', createChildNode);
        c.dom.ignore(elements['node-data'], 'change', updateNode);
        c.dom.ignore(elements['node-delete'], 'click', deleteNode);
        c.dom.ignore(elements['node-move'], 'click', startParentSelectionMode);
        c.dom.ignore(elements.hide, 'click', hideEditor);
    }

    /******************************* Framework Listeners **********************/

    function projectOpened() {
        state.parentSelectionMode = false;
        hideEditor();
    }

    function nodeSelected(treeNode) {

        if (state.parentSelectionMode === true) {
            state.parentSelectionMode = false;
            deleteNode();
            treeNode.children.push(selectedNode);

            c.notify({
                type: 'node-moved',
                data: {
                    parent: treeNode,
                    node: selectedNode
                }
            });
        }

        //trigger a save before changing the editor panel content
        if (selectedNode && selectedNode !== treeNode) {
            updateNode();
        }

        selectedNode = treeNode;

        updateEditor();
        elements['node-label'].focus();
        elements['node-label'].select();

        state.parentSelectionMode = false;

        elements.editor.className = 'active';
    }

    /************************************ GENERAL FUNCTIONS ************************************/

    function hideEditor() {
        elements.editor.className = '';
    }

    function startParentSelectionMode() {
        state.parentSelectionMode = true;
        elements.editor.className = '';
    }

    function deleteNode() {
        var rootNode = c.data.project.projectTree.rootNode;
        c.data.project.projectTree.traverseNode(rootNode, deleteNodeFromParent, rootNode);

        c.notify('node-deleted', selectedNode);

        c.notify('data-changed');

        hideEditor();
    }

    /**
     * [deleteMatchedChild description]
     * @return {[type]} [description]
     */
    function deleteNodeFromParent(node, parent) {
        //use indexof?
        if (node.data === selectedNode.data) {
            parent.children.forEach(function (n, i) {
                if (selectedNode.data === n.data) {
                    parent.children.splice(i, 1);
                }
            });
        }
    }

    function updateNode() {

        selectedNode.data.label = elements['node-label'].value;
        selectedNode.data.description = elements['node-description'].getHTML();
        selectedNode.data.status = elements['node-status'].value;
        selectedNode.data.importance = elements['node-importance'].value;

        c.notify('node-edited', selectedNode);

        c.notify('data-changed');
    }

    function updateEditor() {
        elements['node-label'].value = selectedNode.data.label;
        elements['node-description'].setHTML(selectedNode.data.description);
        elements['node-status'].value = selectedNode.data.status;
        elements['node-importance'].value = selectedNode.data.importance || 1;
    }

    function createChildNode() {
        var node = new window.TreeNode(c.data.project.projectTree);
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
        listeners: {
            'project-opened': projectOpened,
            'node-selected': nodeSelected,
            'node-deselected': hideEditor
        },
        start: initialize,
        stop: destroy,
    };

});
