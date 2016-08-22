var ipcRoot = require('node-ipc');
var ipc = new ipcRoot.IPC;
var address = "addr3";
var fixture1 = "fff";
ipc.config.id = address;
ipc.serve(() => {
    console.log("ggg")
    ipcRoot.connectTo(address, function () {
        console.log("HHHHHHHHHHH");
        ipcRoot.of[address].on('connect', function () {
            ipcRoot.of[address].emit("in1", fixture1);
        })
        ipcRoot.of[address].emit("in1", fixture1);
    })

})
ipc.server.start();
