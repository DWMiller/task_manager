(function() {
    "use strict";
    angular.module("tm-projects", ['tm-project-node'])
        .service("projects", ['projectNode', projectsService]);


    function projectsService(projectNode) {

        return {
            createProject: function() {
                let project = {
                    id: 'task_manager_' + window.uniqueIndex(24),
                    name: 'Unnamed Project',
                    tree: [],
                    settings: {
                        colours: {
                            font: "#000000",
                            edge: '#8E44AD',
                            nodes: {
                                incomplete: {
                                    default: '#F39C12',
                                    selected: '#E67E22',
                                    border: '#BDC3C7'
                                },
                                complete: {
                                    default: '#2ecc71',
                                    selected: '#27ae60',
                                    border: '#BDC3C7'
                                }
                            }
                        }
                    }
                };

                let initialNode = projectNode({
                    label: 'Unnamed Project'
                });

                project.tree.push(initialNode);

                initialNode.addChild(projectNode({
                    label: 'Unnamed Project'
                }))

                return project;
            },
            saveProject: function(project) {
                localStorage.setItem(project.id, JSON.stringify(project));
            },
            getProject: function(projectId) {
                let project = JSON.parse(localStorage.getItem(projectId));
                project.tree = this.restoreTree(project.tree)

                return project;
            },
            restoreTree: function(tree) {
                tree.forEach(this.restoreNode, this);
                return tree;
            },
            restoreNode: function(node, index, array) {
                node = array[index] = projectNode(node);

                if (node.children) {
                    node.children = this.restoreTree(node.children)
                }
            },
            getAllProjects: function() {
                let filenameRegex = new RegExp('task_manager_');

                let projects = {}

                for(var i = 0; i < localStorage.length; i++) {
                    var projectId = localStorage.key(i);
                    if (filenameRegex.test(projectId)) {
                        projects[projectId] = this.getProject(projectId);
                    }
                }

                return projects;
            }

        }
    }

})();



