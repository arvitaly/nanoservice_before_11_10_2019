var ipc = require('node-ipc');
var nanoservice = require('./../index');
describe("Socket server communication", () => {
    it("in", (done) => {
        var address = "addr3";
        var fixture1 = "data1";

        nanoservice({
            in: {
                in1: (data) => {
                    expect(data).toBe(fixture1);
                    done();
                }
            }
        }, {
                transports: {
                    tr1: {
                        opts: {
                            address: address
                        },
                        type: "socket-server"
                    }
                },
                links: [
                    {
                        transport: "tr1",
                        type: "in",
                        name: "in1"
                    }
                ]
            })
        ipc.connectTo(address, function () {
            ipc.of[address].on('connect', function () {
                ipc.of[address].emit("in1", fixture1);
            })
        })
    });
    it("out", (done) => {
        var address = "addr4";
        var fixture1 = "data13";
        var cb;
        nanoservice({
            out: {
                out13: (callback) => {
                    cb = callback;
                }
            }
        }, {
                transports: {
                    tr1: {
                        opts: {
                            address: address
                        },
                        type: "socket-server"
                    }
                },
                links: [
                    {
                        transport: "tr1",
                        type: "out",
                        name: "out13"
                    }
                ]
            }
        )
        ipc.connectTo(address, function () {

            ipc.of[address].on("connect", () => {
                setTimeout(() => {
                    cb(fixture1)
                }, 50)
            })
            ipc.of[address].on("out13", function (data) {
                expect(data).toBe(fixture1);
                done();
            })
        })
    })
});