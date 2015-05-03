module.exports = {
    js: {
        src: [
            // 'js/libs/**/*.js',
            'lib/jquery/jquery.js',
            'lib/dmf/dmf.js',
            'lib/dmf_module_collection/dom/dom.js',
            'lib/springy/springy.js',
            'lib/quill/quill.js',
            'lib/jscolor/jscolor.js',
            'js/config/**/*.js',
            'js/templates/**/*.js',
            'js/classes/**/*.js',
            'js/modules/**/*.js',
            'js/functions/**/*.js',
        ],
        dest: 'dist/js/production.js',
    },
    ie: {
        src: ['js/ie/**/*.js'],
        dest: 'dist/js/shiv.js'
    }
}
