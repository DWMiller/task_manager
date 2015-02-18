dmf.createModule('saver', function(c, config) {
    'use strict';

    var properties = {
        id: 'saver',
        listeners: {
            'project-started': createNewProject,
            'data-changed': dataChanged
        }
    };


    /************************************ MODULE INITIALIZATION ***************/

    function initialize(scope) {}

    function destroy() {}

    /******************************* Framework Listeners **********************/

    function createNewProject() {
        initializeProject();
        dataChanged();

        c.notify('project-opened');
    }

    function dataChanged() {
        c.data.allProjects[c.data.project.projectId] = c.data.project;
        save();

        c.notify('project-saved');
    }

    /************************************ GENERAL FUNCTIONS *******************/

    function initializeProject() {
        c.data.project = {
            activated: false,
            projectId: config.namespace + dmf.fn.uniqueIndex(config['id-length']),
            projectName: 'Unnamed Project',
            projectTree: new dmf.classes.Tree()
        };

        var rootNode = new dmf.classes.TreeNode(c.data.project.projectTree);
        rootNode.data.label = c.data.project.projectName;
        rootNode.data.description = 'No description';

        c.data.project.projectTree.rootNode = rootNode;
    }

    function save() {
        console.log('saved', c.data.project);
        localStorage.setItem(c.data.project.projectId, JSON.stringify(c.data.project));
    }

    return {
        properties: properties,
        initialize: initialize,
        destroy: destroy,
    };

});
