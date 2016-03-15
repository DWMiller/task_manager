module.exports = {
    js: {
        files: ['app/src/**/*.js'],
        tasks: ['dev_js']
    },
    sass: {
        files: ['app/src/**/*.scss'],
        tasks: ['dev_css']
    },
    copy: {
        files: ['app/src/assets/**/*'],
        tasks: ['copy']
    },
    html: {
        files: ['app/index.html', 'app/src/**/*.template.html'],
        tasks: ['dev_html']
    },
    grunt: {
        files: ['grunt/**/*'],
        tasks: [],
        options: {
            spawn: false,
            reload: true
        }
    }
}