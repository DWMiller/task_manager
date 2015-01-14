//http://yuilibrary.com/yui/docs/api/files/tree_js_tree-node.js.html

dmf.classes.TreeNode = function(tree, config) {
    config || (config = {});

    this.tree = tree;

    this.children = config.children || [];
    this.data = config.data || {};
    this.state = config.state || {};

    this._serializable = ['data', 'state'];

    // If this node has children, loop through them and ensure their parent
    // references are all set to this node.
    for (var i = 0, len = this.children.length; i < len; i++) {
        this.children[i].parent = this;
    }
}

dmf.classes.TreeNode.prototype.addChild = function(node) {
    this.children.push(node);
}





dmf.classes.TreeNode.prototype.toJSON = function() {
    var obj = {},
        state = this.state,
        i, key, len;

    // Do nothing if this node is marked as destroyed.
    if (state.destroyed) {
        return null;
    }

    // Serialize properties explicitly marked as serializable.
    for (i = 0, len = this._serializable.length; i < len; i++) {
        key = this._serializable[i];

        if (key in this) {
            obj[key] = this[key];
        }
    }

    // Serialize child nodes.
    obj.children = [];

    for (i = 0, len = this.children.length; i < len; i++) {
        obj.children.push(this.children[i].toJSON());
    }


    return obj;

}

// empty: function (options) {
//                return this.tree.emptyNode(this, options);
//            },
