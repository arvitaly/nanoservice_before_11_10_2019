module.exports = (opts/*:{address:string}*/) => {
    var globalS
    if (typeof (global) == "undefined") {
        globalS = window;
    }else{
        globalS = global;
    }
    if (!globalS['___nanoservices']) {
        globalS['___nanoservices'] = {}
    }
    opts = opts || {};
    opts.address = opts.address || "default";

    var server;
    if (!globalS['___nanoservices'][opts.address]) {
        server = new Server;
        globalS['___nanoservices'][opts.address] = server;
    } else {
        server = globalS['___nanoservices'][opts.address];
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