/**
 * Base config file
 * Not loaded in a specific order, so may override other config files with matching fields
 * Provided as a location for general config settings if an individual file is not appropriate or not preferred.
 * @type {Object}
 */
dmf.fn.extend(dmf.config, {
    globals: {
        version: '0'
    },
    saver: {
        'namespace': 'task_manager_',
        'id-length': 16
    },
    loader: {
        'namespace': 'task_manager_',
    },

});
