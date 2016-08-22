var errors = require('./errors');
var socketClient = require('./socket-client');
var socketServer = require('./socket-server');
module.exports = function (service, config) {
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
        setTimeout(() => {
            service.out[outName](cb);
        })
    }
    for (var inName in service.in) {
        nanoservice.in[inName] = []
    }

    nanoservice.on = function (event, callback) {
        nanoservice.out[event].subsribers.push(callback);
    }
    nanoservice.emit = function (event, data) {
        service.in[event](data);
    }
    var transports = {};
    //Add links
    if (config.transports) {
        for (var transportName in config.transports) {
            switch (config.transports[transportName].type) {
                case "socket-client":
                    transports[transportName] = socketClient(config.transports[transportName].opts);
                    break;
                case "socket-server":
                    transports[transportName] = socketServer(config.transports[transportName].opts);
                    break;
                default:
                    throw new Error(errors.unknownTransportType(config.transports[transportName], config.transports[transportName].type))
            }
        }
    }
    if (config.links) {
        config.links.map((link) => {
            var client = transports[link.transport];
            if (link.type == "in") {
                client.in(link.name, (function (name, data) {
                    this.emit(name, data);
                }).bind(nanoservice, link.name));
            }
            if (link.type == "out") {
                nanoservice.on(link.name, client.out(link.name));
            }
        })
    }
    return nanoservice;
}

/*Config interface
    {
        transports:{
            "tr1":{
                type: "socket-client",
                opts:{
                    id,
                    retry,
                    address
                },
            }
        },
        links:[{
            type: in,
            transport: "tr1",
            name: "in1"
        }
    }]
*/

/*Service interface
    in:{
        in1: function(){
            doSomething()
        }
    },
    out:{
        out1: function(callback){
            callback(args)
        }
    }
*/