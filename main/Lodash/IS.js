// 自我实现
const isNilOwn = (value) => {
    return value === null || value === undefined;
};

// lodash源码
function isNil(value) {
    return value == null; // ECMAScript 规范认为，既然 null 和  undefined 的行为很相似，并且都表示 一个无效的值
}

// null 有属于自己的类型 Null，而不属于Object类型，typeof 之所以会判定为 Object 类型
// 但因为JavaScript 数据类型在底层都是以二进制的形式表示的，二进制的前三位为 0 会被 typeof 判断为对象类型
// 而 null 的二进制位恰好都是 0 ，因此，null 被误判断为 Object 类型

// 获取真实类型
Object.prototype.toString.call(null); // [object Null]
Object.prototype.toString.call(undefined); // [object Undefined]

function isObject(value) {
    const type = typeof value;
    return value != null && (type === 'object' || type === 'function');
}

function isObjectLike(value) {
    return typeof value === 'object' && value !== null;
}

function isPlainObjectOwn(value) {
    // 自我实现
    return (
        value === null ||
        value.__proto__ === Object.prototype ||
        value.__proto__ == null
    );
}

function getTag(value) {
    const toString = Object.prototype.toString;
    // 因为toString方法对null和 undefined都返回为 [object Undefined]
    if (value == null) {
        value === null ? '[object Null]' : '[object Undefined]';
    }
    return toString.call(value);
}

function isPlainObject(value) {
    if (!isObjectLike(value) || getTag(value) != '[object Object]') {
        return false;
    }
    if (Object.getPrototypeOf(value) === null) {
        return true;
    }
    let proto = value;
    // 循环编辑直到prototype 为 null
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
}

function isNumber(value) {
    return (
        typeof value === 'number' ||
        (isObjectLike(value) && getTag(value) === '[object Number]')
    );
}

function isString(value) {
    // 判断 单纯string或者非 Array toString的String实例
    return (
        typeof value === 'string' ||
        (typeof value === 'object' &&
            !Array.isArray(value) &&
            getTag(value) === '[object String]')
    );
}

function isArguments(value) {
    return isObjectLike(value) && getTag(value) === '[object Arguments]';
}

function isBoolean(value) {
    return (
        value === true ||
        value === false ||
        (isObjectLike(value) && getTag(value) === '[object Boolean]')
    );
}
const MAX_SAFE_INTEGER = 9007199254740991;

function isLength(value) {
    return (
        typeof value === 'number' &&
        value > -1 &&
        value % 1 === 0 &&
        value < MAX_SAFE_INTEGER
    );
}

function isArrayLike(value) {
    // 类数组
    return (
        value !== null && typeof value !== 'function' && isLength(value.length)
    );
}

function isArrayLikeObject(value) {
    // 类数组对象
    return isObjectLike(value) && isArrayLike(value);
}

const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

const reIsNative = RegExp(
    `${Function.prototype.toString
        .call(Object.prototype.hasOwnProperty)
        .replace(reRegExpChar, '\\$&') // 在特殊符号前加入 \ 符号
        .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            '$1.*?'
        )}$`
);

function isNative(value) {
    return isObject(value) && reIsNative.test(value);
}

function isElement(value) {
    return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}

function isEmptyOwn(value) {
    // 对于 Map 和 Set没有进行兼容
    return (
        !isObjectLike(value) ||
        (Array.isArray(value) && !value.length) ||
        !Object.keys(value).length // 只适用于prototype
        // 对于有prototype的值会被原型链上的key值影响。for in遍及应该使用hasOwnProperty判断
    );
}

function isPrototype(value) {
    const Ctor = value && value.constructor;
    const proto =
        (typeof Ctor === 'function' && Ctor.constructor) || Object.prototype;
    return value === proto;
}

function isEmpty(value) {
    if (value == null) {
        return true;
    }
    if (
        isArrayLike(value) &&
        (Array.isArray(value) ||
            typeof value === 'string' ||
            typeof value.splice === 'function' ||
            isBuffer(value) ||
            isTypedArray(value) ||
            isArguments(value))
    ) {
        return !value.length;
    }
    const tag = getTag(value);
    if (tag == '[object Map]' || tag == '[object Set]') {
        return !value.size;
    }
    if (isPrototype(value)) {
        return !Object.keys(value).length;
    }
    for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
            return false;
        }
    }
    return true;
}
