#NanoService
[![Build Status](https://travis-ci.org/arvitaly/node-nanoservice.svg?branch=master)](https://travis-ci.org/arvitaly/node-nanoservice)
[![npm version](https://badge.fury.io/js/nanoservice.svg)](https://badge.fury.io/js/nanoservice)

Module for agile interservice-communication with support different transports (like as socket). Every service can has many `in` and `out` links. Every link can has many connections by different transport (example, socket-client or socket-server).


#Example
    var nanoservice = require('nanoservice');
    nanoservice.use('ipc-server', require('nanoservice-transport-ipc-server'));
    var service = {
            out: {
                out1: (callback) => {
                    setTimeout(()=>{ callback("test") }, 100)
                }
            }
        }
    var config = {
                transports: {
                    tr1: {
                        opts: {
                            address: "sock"
                        },
                        type: "ipc-server"
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
            }
    nanoservice(service, config)

#Transports

Now supported 2 transport: sockets and internal

#Event-emitter using

Inside process, you can use nanoservice like as simple event-emitter.

    var e = nanoservice(...);
    e.on("out1",()=>{});
    e.emit("in1", "data");
