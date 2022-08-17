var cost = (function(){
    var args = [];
    return function () {
        if (arguments.length) {
            [].push.apply(args, arguments)
        } else {
            var sam = 0;
            for (var i = 0; i < args.length; i++) {
                sam += args[i];
            }
            return sam;
        }   
    }
})();

cost(100)
cost(200)
console.log(cost());

// 通用currying函数
var currying = function(fn){
    var args = [];
    return function () {
        if (arguments.length) {
            [].push.apply(args, arguments)
        } else {
            fn.apply(this, args)
            return arguments.callee;
        }   
    }
}