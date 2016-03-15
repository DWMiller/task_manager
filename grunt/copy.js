module.exports = {
    assets: {
        files: [
            // includes files within path and its sub-directories
            {
                cwd: 'app/src/',
                src: ['assets/**'],
                dest: 'build/',
                expand: true
            },
            {
                cwd: 'app/',
                src: ['index.html'],
                dest: 'build/',
                expand: true
            }
        ]
    },


};