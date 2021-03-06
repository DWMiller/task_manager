dmf.registerModule('saver', function (c, config) {
    'use strict';

    /************************************ MODULE INITIALIZATION ***************/
    /******************************* Framework Listeners **********************/

    function createNewProject() {
        initializeProject();
        dataChanged();

        c.notify('project-opened');
    }

    function dataChanged() {
        console.log('Change detected', c.data.project);

        // might not be needed to update location in all projects, 
        // only relevant when switching between projects, at which point
        // raw data from local storage could be pulled in again

        c.data.allProjects[c.data.project.projectId] = c.data.project;

        save();
    }

    /************************************ GENERAL FUNCTIONS *******************/

    function initializeProject() {
        c.data.project = {
            activated: false,
            projectId: config.namespace + dmf.fn.uniqueIndex(config['id-length']),
            projectName: 'Unnamed Project',
            projectTree: new window.Tree(),
            settings: {
                colours: {
                    font: "#000000",
                    edge: '#8E44AD',
                    nodes: {
                        incomplete: {
                            default: '#F39C12',
                            selected: '#E67E22',
                            border: '#BDC3C7',
                        },
                        complete: {
                            default: '#2ecc71',
                            selected: '#27ae60',
                            border: '#BDC3C7',
                        }
                    }
                },
            }
        };

        var rootNode = new window.TreeNode(c.data.project.projectTree);
        rootNode.data.label = c.data.project.projectName;
        rootNode.data.description = 'No description';

        c.data.project.projectTree.rootNode = rootNode;
    }

    function save() {
        c.data.project.version = dmf.config.globals.version;
        localStorage.setItem(c.data.project.projectId, JSON.stringify(c.data.project));
        // console.log('saved to local storage', c.data.project);
        c.notify('project-saved');
    }

    return {
        listeners: {
            'project-started': createNewProject,
            'data-changed': dataChanged
        }
    };

});
