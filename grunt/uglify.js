module.exports = {
        options: {
            compress: {
                drop_console: false//true
            }
        },    
    dist: {
        files: {
            'build/js/combined.min.js': ['build/js/combined.js']
        }
    }
}