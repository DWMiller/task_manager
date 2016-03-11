module.exports = {
    assets: {
        files: [
            // includes files within path and its sub-directories
            {
                cwd: 'src/',
                src: ['assets/**'],
                dest: 'dist/',
                expand: true
            },
            {
                cwd: 'src/',
                src: ['index.html'],
                dest: 'dist/',
                expand: true
            }
        ]
    },


};