var ipc = require('node-ipc');
var nanoservice = require('./../index');
describe("Socket client communication", () => {
    it("in", (done) => {
        var fixture1 = "data1";
        ipc.config.id = 'addr1';
        ipc.serve(function () {
            ipc.server.on('connect', function (socket) {
                ipc.server.emit(socket, 'event2', fixture1);
            });

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
                                address: "addr1"
                            },
                            type: "socket-client"
                        }
                    },
                    links: [
                        {
                            transport: "tr1",
                            type: "in",
                            name: "in1",
                            to: "event2"
                        }
                    ]
                })

        });

        ipc.server.start();



    })
    it("out", (done) => {
        var fixture1 = "data2";

        ipc.config.id = 'addr2';
        ipc.serve(function () {
            ipc.server.on('connect', function () {

            });
            ipc.server.on("event1", (data) => {
                expect(data).toBe(fixture1);
                done();
            });

            nanoservice({
                out: {
                    out1: (callback) => {
                        callback(fixture1)
                    }
                }
            }, {
                    transports: {
                        tr1: {
                            opts: {
                                address: "addr2"
                            },
                            type: "socket-client"
                        }
                    },
                    links: [
                        {
                            transport: "tr1",
                            type: "out",
                            name: "out1",
                            to: "event1"
                        }
                    ]
                })
        });
        ipc.server.start();
    })
})