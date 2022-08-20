var proxyCacheFactory = function(fn){
    var cache = {}
    return function () {
        var cacheName = Array.prototype.join.call(arguments)
        if (cacheName in cache) {
            return cache[cacheName]
        }
        return cache[cacheName] = fn.apply(this, arguments)
    }
}