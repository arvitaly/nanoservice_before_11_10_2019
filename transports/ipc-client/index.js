/*::import type {Options} from './interfaces/socket-client'*/
var ipcRoot = require('node-ipc');

module.exports = function (opts/*:Options*/) {
    var ipc = new ipcRoot.IPC
    opts = opts || {}
    ipc.config.id = opts.id || process.env.ID || 'hello';
    ipc.config.retry = opts.retry || 1500;
    var address = opts.address || 'world';
    ipc.connectTo(address, function () {
        ipc.of[address].on('connect', function () {
            ipc.log('## connected to ' + address + ' ##'.rainbow, ipc.config.delay);
            /*ipc.of.world.emit('register', {
                type: type,
                name: method
            })*/
        });
        ipc.of[address].on('disconnect', function () {
            ipc.log('disconnected from ' + address + ' '.notice);
        });
    });

    return {
        in: function (name, callback) {
            ipc.of[address].on(name, function (data) {
                ipc.log('got a message from world : '.debug, data);
                callback(data);
            });
        },
        out: function (name) {
            var cb = function (data) {
                ipc.of[address].emit(name, data);
            }
            return cb;
        }
    }
}
