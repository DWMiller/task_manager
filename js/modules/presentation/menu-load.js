dmf.createModule('menu-load', function(c) {
    'use strict';

    var p_properties = {
        id: 'menu-load',
        selector: 'menu-load',
        listeners: {
            'projects-loaded': populateProjects,
            'project-saved': populateProjects, // This is fairly intensive, don't do it or do differently
        }
    };

    var elements = {};

    /************************************ MODULE INITIALIZATION ************************************/

    function p_initialize(scope) {
        elements['project-list'] = document.getElementById('existing-projects');
        bindEvents();
    }

    function p_destroy() {
        unbindEvents();
        elements = null;
    }

    function bindEvents() {
        c.dom.listen(elements['project-list'], 'change', projectOpen);
    }

    function unbindEvents() {
        c.dom.ignore(elements['project-list'], 'change', projectOpen);
    }

    /************************************ GENERAL FUNCTIONS ************************************/

    function clearList() {
        c.dom.emptyNode(elements['project-list']);
    }


    function populateProjects() {
        clearList();

        var option = document.createElement("option");
        option.text = 'Select a Project';
        elements['project-list'].appendChild(option);

        for (var project in c.data.allProjects) {
            addProjectToList(c.data.allProjects[project]);
        }

        if (c.data.project) {
            // don't bother opening last project if a project is already open
            // only for first load
            return;
        }

        var lastOpened = localStorage.getItem('last-opened');

        if (lastOpened && c.data.allProjects[lastOpened]) {
            elements['project-list'].value = lastOpened;
            projectOpen();
        }
    }

    function addProjectToList(project) {
        var option = document.createElement("option");
        option.text = (project.projectName || 'Unnamed Project'); //project.projectId;
        option.value = project.projectId;
        elements['project-list'].appendChild(option);
    }

    function projectOpen(event) {
        var selectedIndex = elements['project-list'].selectedIndex;
        var projectId = elements['project-list'][selectedIndex].value;

        // c.data.project = c.data.allProjects[projectId];

        var projectData = JSON.parse(localStorage.getItem(projectId));
        var treeData = projectData.projectTree;

        var newTree = new dmf.classes.Tree();
        newTree.rootNode = new dmf.classes.TreeNode(newTree, treeData);

        projectData.projectTree = newTree;

        c.data.project = projectData;

        if (!c.data.project.settings) {
            //This is temporary to ensure old projects get their data format updated
            c.data.project.settings = {
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
            };
        }

        localStorage.setItem('last-opened', projectId);
        c.notify('project-opened');
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
