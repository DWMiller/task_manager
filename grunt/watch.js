module.exports = {
    js: {
        files: ['src/js/**/*'],
        tasks: ['newer:concat', 'version']
    },
    sass: {
        files: ['src/sass/**/*'],
        tasks: ['sass', 'version']
    },
    copy: {
        files: ['src/assets/**/*'],
        tasks: ['newer:copy']
    },
    html: {
        files: ['src/index.html'],
        tasks: ['newer:copy','version']
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