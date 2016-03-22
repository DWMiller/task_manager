(function() {
    "use strict";
    angular.module('tm-node-editor').controller("nodeEditorController",
        ['$scope', nodeEditorController]);

    function nodeEditorController($scope) {
        let nodeEditor = this;

        nodeEditor.data = {
            node: null,
            pendingParentSelection: null
        };

        nodeEditor.state = {
            active: false,
        };

        $scope.$on('node-selected', function(event, args) {
            nodeEditor.state.active = true;
            nodeEditor.data.node = args.node;
            $scope.$apply();
            nodeSelected(nodeEditor.data.node)
        });

        function nodeSelected(node) {

            if (nodeEditor.data.pendingParentSelection) {
                // deleteNode();

                if (!node.hasOwnProperty('children')) {
                    node.children = [];
                }

                node.children.push(nodeEditor.data.pendingParentSelection);
                // c.notify({
                //     type: 'node-moved',
                //     data: {
                //         parent: treeNode,
                //         node: selectedNode
                //     }
                // });
                nodeEditor.data.pendingParentSelection = null;
            }

            //trigger a save before changing the editor panel content
            // if (selectedNode && selectedNode !== treeNode) {
            //     updateNode();
            // }

            // selectedNode = treeNode;

            // elements['node-label'].focus();
            // elements['node-label'].select();

            // state.parentSelectionMode = false;
        }

        // nodeEditor.deleteNode = function() {
        //     var rootNode = c.data.project.projectTree.rootNode;
        //     c.data.project.projectTree.traverseNode(rootNode, deleteNodeFromParent, rootNode);
        //
        //     c.notify('node-deleted', selectedNode);
        //
        //     c.notify('data-changed');
        //     nodeEditor.state.active = false;
        // };

        nodeEditor.updateNode = function() {
            selectedNode.data.label = elements['node-label'].value;
            selectedNode.data.description = elements['node-description'].getHTML();
            selectedNode.data.status = elements['node-status'].value;
            selectedNode.data.importance = elements['node-importance'].value;

            c.notify('node-edited', selectedNode);

            c.notify('data-changed');
        };

        nodeEditor.createChildNode = function() {
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
        };

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

        nodeEditor.startParentSelectionMode = function() {
            nodeEditor.data.pendingParentSelection = nodeEditor.data.node;
        }
    }
})();