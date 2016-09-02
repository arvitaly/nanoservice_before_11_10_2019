var errors = require('./errors');
var Nanoservice = function (service, config) {
    config = config || {};
    var nanoservice = {}
    nanoservice.out = {};
    nanoservice.in = {}
    for (var outName in service.out) {
        nanoservice.out[outName] = {
            func: null,
            subsribers: []
        }
        var cb = (function (outName, data) {
            nanoservice.out[outName].subsribers.map((cb) => {
                cb(data);
            })
        }).bind(undefined, outName)
        nanoservice.out[outName].func = cb;
        setTimeout(((service, outName, cb) => {
            service.out[outName](cb);
        }).bind(undefined, service, outName, cb))
    }
    for (var inName in service.in) {
        nanoservice.in[inName] = []
    }

    nanoservice.on = function (event/*:string*/, callback/*:function*/) {
        nanoservice.out[event].subsribers.push(callback);
    }
    nanoservice.emit = function (event/*:string*/, data/*:any*/) {
        service.in[event](data);
    }
    var transports = {};
    //Add links    
    if (config.transports) {
        for (var transportName in config.transports) {
            if (!Nanoservice.transports[config.transports[transportName].type]) {
                var err = errors.unknownTransportType(config.transports[transportName].type, config.transports[transportName])
                console.error(err)
                throw new Error(err)
            }
            transports[transportName] = Nanoservice.transports[config.transports[transportName].type](config.transports[transportName].opts);
        }
    }
    if (config.links) {
        config.links.map((link) => {
            var client = transports[link.transport];
            if (link.type == "in") {
                client.in(link.to, (function (name, data) {
                    this.emit(name, data);
                }).bind(nanoservice, link.name));
            }
            if (link.type == "out") {
                nanoservice.on(link.name, client.out(link.to));
            }
        })
    }
    return nanoservice;
}
Nanoservice.use = function (transportName/*:string*/, transport) {
    Nanoservice.transports[transportName] = transport;
}
Nanoservice.transports = {

};
module.exports = Nanoservice;
