dmf.fn['input-focus'] = function() {
    this.parentNode.classList.add('focus');
}

dmf.fn['input-blur'] = function() {
    this.parentNode.classList.remove('focus');
    if (this.value.length > 0) {
        this.parentNode.classList.add('data');
    } else {
        this.parentNode.classList.remove('data');
    }
}
