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
            projectTree: new dmf.classes.Tree()
        };

        var rootNode = new dmf.classes.TreeNode(c.data.project.projectTree);
        rootNode.data.label = c.data.project.projectName;
        rootNode.data.description = 'No description';

        c.data.project.projectTree.rootNode = rootNode;
    }

    function save() {
        localStorage.setItem(c.data.project.projectId, JSON.stringify(c.data.project));
        console.log('saved to local storage', c.data.project);
        c.notify('project-saved');
    }

    return {
        properties: properties,
    };

});
