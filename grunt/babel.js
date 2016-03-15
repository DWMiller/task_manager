module.exports = {
    options: {
        sourceMap: true,
        presets: ['babel-preset-es2015']
    },
    default: {
        files: {
            "build/js/combined.js": "build/js/combined_es6.js"
        }
    }
};