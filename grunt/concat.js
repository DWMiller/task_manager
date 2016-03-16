module.exports = {
    vendor: {
        options: {
            sourceMap: true
        },
        src: [
            "bower_components/angular/angular.js",
            "bower_components/angular-ui-router/release/angular-ui-router.js",
            'bower_components/jquery/dist/jquery.js',
            'bower_components/jscolor/jscolor.js',
            'bower_components/springy/springy.js',
            "bower_components/stampit/stampit.js",
            'bower_components/quill/dist/quill.js'
        ],
        dest: 'build/js/vendor.js'
    },
    app: {
        options: {
            sourceMap: true
        },
        src: [
            "app/src/core/app.module.js",
            "app/src/**/*.module.js",
            "app/src/**/*.config.js",
            "app/src/**/*.controller.js",
            "app/src/**/*.js"
        ],
        dest: 'build/js/combined_es6.js'
    }
};
