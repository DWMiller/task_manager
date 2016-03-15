module.exports = {
    build: {
        options: {
            base: 'app/'
        },
        files: {
            'build/index.html': ['app/src/**/*.template.html']
        }
    }
};