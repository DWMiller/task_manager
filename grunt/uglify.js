module.exports = {
        options: {
            compress: {
                drop_console: false//true
            }
        },    
    dist: {
        files: {
            'dist/js/production.min.js': ['dist/js/production.js']
        }
    }
}