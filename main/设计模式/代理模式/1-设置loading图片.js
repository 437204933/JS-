var MyImage = (function(){
    var img = document.createElement('img')
    document.appendChild(img)
    return function (src) {
        img.src = src
    }
}())

var ProxyImage = (function(){
    var img = new MyImage()
    img.onLoad = function () {
        myImage(this.src)
    }
    return function (src) {
        myImage('loading.png')
        img.src = src
    }
}())