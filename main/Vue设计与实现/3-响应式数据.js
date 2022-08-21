var bucket = new Set()

var data = {text: '数据代理'}

var obj = new Proxy(data, {
    get(target, key) {
        bucket.add(effect)
        return target[key]
    },
    set(target, key, newValue) {
        target[key] = newValue
        bucket.forEach(fn => fn())
        return true
    }
})

var activeEffectStack = [];
var activeEffect;
// 应付迭代嵌套
function effect (fn, option = {}) {
    const effectFn = () => {
        clearEffect(fn)
        activeEffect = effectFn
        activeEffectStack.push(fn)
        const res = fn()
        activeEffectStack.pop(fn)
        activeEffect = activeEffectStack[activeEffectStack.length - 1];
        return res;
    }
    effectFn.option = option
    effectFn.deps = []
    if (!option.lazy) effectFn()
    return effectFn;
}

function clearEffect (fn) {
    const deps = fn.deps
   for (let index = 0; index < deps.length; index++) {
        const effect = deps[index];
        deps.delete(effect)
   } 
   fn.deps.length = 0
}

var bucket = new WeakMap()

var obj = new Proxy(data, {
    get(target, key) {
        track(target, key) 
        return target[key]
    },
    set (target, key, newValue) {
        target[key] = newValue;
        trigger (target, key);
    }
})

function track (target, key) {
    if (activeEffect) return
    const depsMap = bucket.get(target)
    if (!depsMap) bucket.set(target, (depsMap = new Map()))
    const deps = depsMap.get(key)
    if(!deps) depsMap.set(key, (deps = new Set()))
    activeEffect.deps = deps
    deps.add(activeEffect)
}

function trigger (target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    const effectToRun = new Set(effects)
    effectToRun && effectToRun.forEach(effectFn => {
        if (effectFn !== activeEffect) {
            if (effectFn.option.scheduler) {
                effectFn.option.scheduler(effectFn)
            } else {
                effectFn()
            }
        }
    }
    )
}

const args = new Set([1])
args.forEach(() => {
    arg.delete(1)
    arg.add(1)
    console.log('do');
})

// 定义一个任务队列
var jobQueue = new Set()
var p = Promise.resolve()

let isFishing = false
function flushJob() {
    if (!isFishing) return
    isFishing = true
    p.then(() => jobQueue.forEach(fn => fn())).finally(() => {
        isFishing = false
    })
}

function computed(getter) {
    let value
    let dirty = true
    // 获取值
    const effectFn = effect(getter, {
        lazy: true, 
        scheduler: () => {
            dirty = true
            trigger(obj, 'value')
        }
    })
    const obj = {
        get value () {
            if (dirty) {
                value = effectFn()
                dirty = false
            }
            return value
        }
    }
    return obj
}

function watch (source, cb, options = {}) {
    let getter;
    if (typeof source === 'function') {
        getter = source
    } else {
        getter = () => traverse(source)
    }
    let oldValue, newValue;

    function job () {
        newValue = effectFn()
        cb(oldValue, newValue)
        oldValue = newValue
    }

    const effectFn = effect(() => getter(), {
        lazy: true, // 设置 lazy 属性手动调用获取旧值，再次调用时获取最新值
        scheduler: () => {
            if (option.flush === 'post') {
                const p = Promise.resolve();
                p,then(job)
            } else {
                job()
            }
        }
    })

    if (option.immediate) {
        job()
    }
}

function traverse (value, seen = new Set()) {
    if (typeof value !== 'object' || value === null || seen.has(value)) return
    seen.add(value)
    // 对所有属性都进行遍及，当任何属性变化都活触发函数
    for (const k in value) {
        traverse(value[k], seen)
    }
    return value
}