module.exports = {
    js: {
        src: [
            // 'js/libs/**/*.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/dmf/dist/dmf.js',
            'bower_components/dmf_module_collection/dom/dom.js',
            'bower_components/springy/springy.js',
            'bower_components/quill/dist/quill.js',
            'bower_components/jscolor/jscolor.js',
            'src/js/config/**/*.js',
            'src/js/templates/**/*.js',
            'src/js/classes/**/*.js',
            'src/js/modules/**/*.js',
            'src/js/functions/**/*.js'
        ],
        dest: 'dist/js/production.js'
    }
}
