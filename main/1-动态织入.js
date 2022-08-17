Function.prototype.before = (beforeFn) => {
    var _self = this;
    return function () {
        beforeFn.apply(this, arguments);
        return _self.apply(this, arguments);
    }
}

Function.prototype.after = (afterFn) => {
    var _self = this;
    return function () {
        var net = _self.apply(this, arguments);
        beforeFn.apply(this, arguments);
        return net;
    }
}

var func = function () {
    console.log(1);
}

func = func.before(() => {
    console.log(0);
}).after(() => {
    console.log(2);
})

func()
