function mountElement (vnode, container) {
    const el = document.createElement(vnode.tag);
    for(const key in vnode.props) {
        if(/^on/.test(key)) {
            el.addEventListener(key.substring(2).toLowerCase(), vnode.props[key], false);
        }
    }

    if (typeof vnode.children === 'string') {
        el.appendChild(document.createTextNode(vnode.children));
    } else if (Array.isArray(vnode.children)) {
        vnode.children.foreach(child => renderer(child, el));
    }

    container.appendChild(el);
}

function mountComponent (vnode, container) {
    const subTree = vnode.tag.render();
    mountElement(subTree, container);
}

function renderer (vnode, container) {
    if (typeof vnode.tag === 'string') {
        mountElement(vnode, container);
    } else if (typeof vnode.tag === 'object') {
        mountComponent(vnode, container)
    }
}