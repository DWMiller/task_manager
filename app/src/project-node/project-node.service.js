(function () {
    "use strict";
    angular.module("tm-project-node", [])
        .service("projectNode", [projectNode]);

    function projectNode() {
        return stampit({
            methods: {
                addChild: function (node) {
                    if (!this.children) {
                        this.children = [];
                    }

                    this.children.push(node);
                },
                toJSON: function () {
                    var obj = angular.extend({}, this);

                    delete obj.graphNode;
                    delete obj.graphParentEdge;
                    delete obj.parent;

                    // state = this.state,
                    // i, key, len;

                    // Do nothing if this node is marked as destroyed.
                    // if (state.destroyed) {
                    //     return null;
                    // }

                    // Serialize properties explicitly marked as serializable.
                    // for (i = 0, len = this._serializable.length; i < len; i++) {
                    //     key = this._serializable[i];
                    //
                    //     if (key in this) {
                    //         obj[key] = this[key];
                    //     }
                    // }

                    // Serialize child nodes.
                    // obj.children = [];
                    //
                    // for (i = 0, len = this.children.length; i < len; i++) {
                    //     obj.children.push(this.children[i].toJSON());
                    // }

                    return obj;
                }

            },
            refs: {
                //A map of property names and values to be mixed into each new object.
                //An object to be deeply cloned into each newly stamped object.
            },
            init: function () {
                //A closure (function) used to create private data and privileged methods.
            },
            props: {
                label: 'Unlabeled',
                description: 'No description',
                status: 'incomplete',
                importance: 1
            },
            static: {
                traverseNode: function (node, callback, parent) {
                    callback(node, parent);

                    if (node.hasOwnProperty('children')) {

                        for (var i = 0, len = node.children.length; i < len; i++) {
                            // if (!node.children[i].hasOwnProperty('traverseNode')) {
                            // If not a node, create a node
                            // node.children[i] = new window.TreeNode(this, node.children[i]);
                            // }
                            this.traverseNode(node.children[i], callback, node);
                        }

                    }
                }
            } //add properties to stamp, not an object
        });

    }

})();



