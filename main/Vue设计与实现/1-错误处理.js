let handError = null;
// 为用户自动捕获错误信息
function callWithError (fn) {
    try {
        fn && fn()
    } catch (e) {
        handError(e)
    }
}
// 用户可以直接注册错误处理函数
function registerErrorHandler (fn) {
    handError = fn
}

