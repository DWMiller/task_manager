(function() {
    "use strict";
    angular.module("tm-project-node", [])
        .service("projectNode", [projectNode]);

    function projectNode() {
        return stampit({
            methods: {
                addChild: function(node) {
                    if (!this.children) {
                        this.children = [];
                    }

                    this.children.push(node);
                }
            },
            refs: {
                //A map of property names and values to be mixed into each new object.
                //An object to be deeply cloned into each newly stamped object.
            },
            init: function() {
                //A closure (function) used to create private data and privileged methods.
            },
            props: {
                label: 'Unlabeled',
                description: 'No description',
            }
            //static: {} //add properties to stamp, not an object
        });

    }

})();



