(function () {
    "use strict";
    angular.module('tm-node-editor').controller("nodeEditorController",
        ['$rootScope', '$scope', 'projectNode', nodeEditorController]);

    function nodeEditorController($rootScope, $scope, projectNode) {
        let nodeEditor = this;
        let watcher = null;

        nodeEditor.data = {
            node: null,
            pendingParentSelection: null
        };

        nodeEditor.state = {
            active: false,
        };

        $scope.$on('node-selected', function (event, args) {
            if (nodeEditor.data.pendingParentSelection) {
                newParentSelected(args.node);
            } else {
                nodeSelected(args.node)
            }

            $scope.$apply();
        });

        nodeEditor.hideEditorClick = function () {
            nodeEditor.state.active = false;
        };

        function nodeSelected(node) {
            if (watcher) {
                watcher();
            }

            watcher = $scope.$watchCollection(function () {
                return node;
            }, function (node) {
                console.log(node);
                $rootScope.$broadcast('node-edited', {
                    node: node
                });
            });

            nodeEditor.data.node = node;
            nodeEditor.state.active = true;
            // elements['node-label'].focus();
            // elements['node-label'].select();
        }

        function newParentSelected(parentNode) {
            moveNode(nodeEditor.data.pendingParentSelection, parentNode);
            nodeEditor.data.pendingParentSelection = null;
        }

        function moveNode(node, newParent) {

            detachNode(node, node.parent);

            if (!newParent.hasOwnProperty('children')) {
                newParent.children = [];
            }

            newParent.children.push(node);
            node.parent = newParent;

            $rootScope.$broadcast('node-moved', {
                parent: newParent,
                node: node
            });
        }

        nodeEditor.deleteNode = function (node) {
            if (node.root) {
                return;
            }

            detachNode(node, node.parent);

            $rootScope.$broadcast('node-deleted', {
                parent: node.parent,
                node: node
            });

            nodeEditor.hideEditorClick();

            // var rootNode = c.data.project.projectTree.rootNode;
            // c.data.project.projectTree.traverseNode(rootNode, deleteNodeFromParent, rootNode);
            // 
            // c.notify('node-deleted', selectedNode);
            //
            // c.notify('data-changed');
            // nodeEditor.state.active = false;
        };

        function detachNode(node, parent) {
            let childIndex = parent.children.indexOf(node);
            parent.children.splice(childIndex, 1);
        }

        nodeEditor.createChildNode = function (node) {

            let newNode = projectNode({
                label: 'child of ' + node.label
            });

            node.addChild(newNode);

            $rootScope.$broadcast('node-created', {
                node: newNode,
                parent: node
            });
        };

        nodeEditor.startParentSelectionMode = function (node) {
            if (node.root) {
                return;
            }

            nodeEditor.hideEditorClick();
            nodeEditor.data.pendingParentSelection = node;
        }
    }
})();