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

var activeEffect;

function effect (fn) {
    const effectFn = () => {
        activeEffect = fn;
        clearEffect(fn)
        fn()
    }
    effectFn.deps = []
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
    effectToRun && effectToRun.forEach(effect => effect())
}

const args = new Set([1])
args.forEach(() => {
    arg.delete(1)
    arg.add(1)
    console.log('do');
})
