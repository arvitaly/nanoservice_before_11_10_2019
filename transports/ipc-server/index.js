var ipcRoot = require('node-ipc');

module.exports = function (opts, callback) {
    var ipc = new ipcRoot.IPC
    opts = opts || {}
    ipc.config.retry = opts.retry || 1500;
    ipc.config.id = opts.address;
    ipc.serve(callback)
    ipc.server.start();

    return {
        in: function (name, callback) {

            ipc.server.on(name, function (data) {
                ipc.log('got a message from world : '.debug, data);
                callback(data);
            });
        },
        out: function (name) {
            var cb = function (data) {
                ipc.server.broadcast(name, data);
            }
            return cb;
        }
    }

}