var getSingle = function(fn) {
    var result;
    return function () {
        return result || (result = fn.apply(this, arguments));
    }
}

var initValue = (value, setFn) => {
    var firstTime = true;
    return function () {
        if (value && firstTime) {
            setFn(value);
            firstTime = false;
        }
    }
}