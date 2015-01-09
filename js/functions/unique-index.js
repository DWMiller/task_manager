dmf.fn.uniqueIndex = function(length) {
    'use strict';
    var charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charSetSize = charSet.length;

    var id = '';
    for (var i = 1; i <= length; i++) {
        var randPos = Math.floor(Math.random() * charSetSize);
        id += charSet[randPos];
    }
    return id;
}
