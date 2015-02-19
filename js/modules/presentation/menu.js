dmf.createModule('menu', function(c) {
    'use strict';

    var p_properties = {
        id: 'menu',
        selector: 'menu',
        listeners: {}
    };

    var elements = {},
        menuOpened = false;

    /************************************ MODULE INITIALIZATION ************************************/

    function p_initialize(scope) {
        elements = {
            //should not reference elements in different scope, use framework event instead
            'menu-toggle': document.getElementById('menu-toggle'),
            'main': document.getElementById('main'),
            'project-create': document.getElementById('project-create'),
            'project-import': document.getElementById('project-import'),
            'project-export': document.getElementById('project-export'),
        };

        bindEvents();
    }

    function p_destroy() {
        unbindEvents();
        elements = null;
    }

    function bindEvents() {
        c.dom.listen(elements['menu-toggle'], 'click', toggleMenu);
        c.dom.listen(elements['project-create'], 'click', projectCreate);
        c.dom.listen(elements['project-import'], 'change', projectImport);
        c.dom.listen(elements['project-export'], 'click', projectExport);
        c.dom.listen(elements.main, 'click', closeMenu);
    }

    function unbindEvents() {
        c.dom.ignore(elements['menu-toggle'], 'click', toggleMenu);
        c.dom.ignore(elements['project-create'], 'click', projectCreate);
        c.dom.ignore(elements['project-import'], 'change', projectImport);
        c.dom.ignore(elements['project-export'], 'click', projectExport);
        c.dom.ignore(elements.main, 'click', closeMenu);
    }

    /************************************ GENERAL FUNCTIONS ************************************/


    function projectCreate() {
        c.notify('project-started');
    }

    function projectImport(e) {
        var fileList = e.target.files;
        var file = fileList[0];

        var reader = new FileReader();
        reader.onload = function(f) {
            parseFile(f.target.result);
        };

        reader.readAsText(file);
    }

    function parseFile(jsonFile) {
        var project = JSON.parse(jsonFile);
        var projectId = project.projectId;
        localStorage.setItem(projectId, JSON.stringify(project));

        c.notify('project-imported');
    }

    function projectExport() {
        var projectId = c.data.project.projectId;
        var projectName = c.data.project.projectName;
        download(projectName + '.json', localStorage.getItem(projectId));
    }

    function toggleMenu() {
        if (menuOpened) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        c.dom.toggleClass(elements.main, 'menu-active');
    }

    function closeMenu() {
        elements.main.className = '';
    }

    function download(filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
        pom.click();
        pom.parentNode.removeChild(pom);
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
