var errors = require('./errors');
var extend = require('deep-extend');
var EventEmitter2 = require('eventemitter2').EventEmitter2;
module.exports = (opts) => {
    opts = extend({
        transports: {}
    }, opts)
    return (service, config) => {
        config = extend({
            args: null,
            services: {},
            transports: {},
            links: [],
            env: {}
        }, config);

        var emitter = new EventEmitter2({});

        var ins = service({
            args: config.args,
            out: {
                emit: (name, data) => {
                    emitter.emit(name, data);
                }
            },
            services: {
                add: () => { },
                set: () => { },
                remove: () => { },
                removeAll: () => { }
            },
            env: (name) => {
                return config.env[name];
            }
        });
        for (var inName in ins) {
            emitter.on(inName, ins[inName]);
        }

        var transports = {};
        //Add transports
        for (var transportName in config.transports) {
            var transportConfig = config.transports[transportName];
            var transportClass = opts.transports[transportConfig.type];
            if (!transportClass) {
                throw new Error(errors.unknownTransportType(transportName, transportConfig));
            }
            transports[transportName] = transportClass(transportConfig.opts);
        }
        config.links.map((link) => {
            switch (link.type) {
                case "in":
                    transports[link.transport].in(link.to, emitter.emit.bind(emitter, link.name));
                    break;
                case "out":                 
                    emitter.on(link.name, transports[link.transport].out(link.to));
                    break;
            }
        });
        return emitter;
    }
}