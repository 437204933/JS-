var MyApp = {}
MyApp.namespace = function(name) {
    var parts = name.split('.');
    var current = MyApp;
    for (var i = 0; i < parts.length;) {
        if (!current[parts[i]]) {
            current[parts[i]] = {}
        }
        current = current[parts[i]];
    }
}