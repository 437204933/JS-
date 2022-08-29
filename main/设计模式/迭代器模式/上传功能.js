var getActiveUploaderObj = function() {
    try {
        return new ActiveXObject("TXFTNActiveX.FTNUpload"); // IE 上传组件
    }catch (e) {
        return false
    }
}

var getFlashUploaderObj = function() {
    if (supportFlash()) {
        var str = '<object></object>';
        return $(str).appendTo($('body'))
    }
    return false
}

var iteratorUploadObj = function() {
    for (var i = 0; i < arguments.length; i++) {
        let uploadObj = arguments(i)();
        if (uploadObj !== false) {
            return value
        }
    }
}

var uploadObj = iteratorUploadObj(getActiveUploaderObj, getFlashUploaderObj)