module.exports = {
    default: [
        'concat:vendor',
        'concat:app',
        'babel',
        'copy',
        'sass',
        'inline_angular_templates',
        //'uglify',
        'version',
        'notify:dev'
    ],
    dev_js: [
        'concat:app',
        'babel',
        'version:patch',
        'notify:dev'
    ],
    dev_css: [
        'sass',
        'version:patch',
        'notify:dev'
    ],
    dev_html: [
        'copy',
        'inline_angular_templates',
        'version:patch',
        'notify:dev'
    ]
};