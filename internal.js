// @flow
/*:: import type {TransportType} from './interfaces/transport'*/
module.exports = (opts/*:{address:string}*/) => {
    if (!global['___nanoservices']) {
        global['___nanoservices'] = {}
    }
    opts = opts || {};
    opts.address = opts.address || "default";

    var server;
    if (!global['___nanoservices'][opts.address]) {
        server = new Server;
        global['___nanoservices'][opts.address] = server;
    } else {
        server = global['___nanoservices'][opts.address];
    }


    var transport/*:TransportType*/ = {
        in: function (name, callback) {
            if (!server.links[name]) {
                server.links[name] = []
            }
            server.on(name, callback)
        },
        out: function (name) {
            if (!server.links[name]) {
                server.links[name] = []
            }
            return (data) => {
                server.emit(name, data);
            }
        }
    }
    return transport;
}

var Server = function () {
    this.links = {};
    this.emit = (name, data) => {
        if (this.links[name]) {
            this.links[name].map((cb) => {
                cb(data);
            })
        }
    }
    this.on = (name, callback) => {
        this.links[name].push(callback);
    }
};