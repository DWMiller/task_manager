dmf.fn.shuffleArray = function(array) {
    var tmp, randomIndex, pointer = array.length;
    if (pointer)
        while (--pointer) {
            randomIndex = Math.floor(Math.random() * (pointer + 1));
            tmp = array[randomIndex];
            array[randomIndex] = array[pointer];
            array[pointer] = tmp;
        }
    return array;
};
