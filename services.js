module.exports = function (servicesClasses) {
    var services = {};
    function add(subServiceConfig) {
        if (services[subServiceConfig.id]) {
            return;
        }
        var config = {
            args: subServiceConfig.args,
            transports: subServiceConfig.transports,
            links: subServiceConfig.links
        }
        services[subServiceConfig.id] = {
            config: subServiceConfig,
            service: servicesClasses[subServiceConfig.type](config)
        };
        services[subServiceConfig.id].service.onRemoved(() => {
            var config = services[subServiceConfig.id].config;
            delete services[subServiceConfig.id];
            add(config)
        })
    }
    function remove(id) {
        if (!services[id]) {
            return;
        }
        services[id].service.remove();
        delete services[id];
    }
    return {
        add: add,
        set: (newServices) => {
            var ids = newServices.map((service) => {
                if (!services[service.id]) {
                    add(service);
                }
                return service.id;
            })
            var removeIds = [];
            for (var id in services) {
                if (ids.indexOf(id) === -1) {
                    removeIds.push(id);
                }
            }
            
            removeIds.map(remove)
        },
        remove: remove,
        removeAll: () => {
            var ids = []
            for (var id in services) {
                ids.push(id);
            }
            ids.map((id) => {
                remove(id);
            })
        }
    }
}