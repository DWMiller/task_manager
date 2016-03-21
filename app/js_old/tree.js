//http://yuilibrary.com/yui/docs/api/files/tree_js_tree.js.html#l17

window.Tree = function() {
    this.rootNode = null;
}

window.Tree.prototype.destructor = function() {
    this.destroyNode(this.rootNode);
    this.rootNode = null;
}

window.Tree.prototype.destroyNode = function(node) {
    var child, i, len;
    for (i = 0, len = node.children.length; i < len; i++) {
        child = node.children[i];

        // Manually remove the child from its parent; this makes destroying
        // all children of the parent much faster since there's no splicing
        // involved.
        child.parent = null;

        // Destroy the child.
        this.destroyNode(child);
    }
}

window.Tree.prototype.traverseNode = function(node, callback, parent) {
    callback(node, parent);

    for (var i = 0, len = node.children.length; i < len; i++) {
        if (!node.children[i].hasOwnProperty('traverseNode')) {
            // If not a node, create a node 
            node.children[i] = new window.TreeNode(this, node.children[i]);
        }
        this.traverseNode(node.children[i], callback, node);
    }
}

window.Tree.prototype.toJSON = function() {
    return this.rootNode.toJSON();
}
