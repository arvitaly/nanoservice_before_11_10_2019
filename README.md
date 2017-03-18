#NanoService

[![npm version](https://badge.fury.io/js/nanoservice.svg)](https://badge.fury.io/js/nanoservice)
[![Build Status](https://travis-ci.org/arvitaly/nanoservice.svg?branch=master)](https://travis-ci.org/arvitaly/nanoservice)
[![Coverage Status](https://coveralls.io/repos/github/arvitaly/nanoservice/badge.svg?branch=master)](https://coveralls.io/github/arvitaly/nanoservice?branch=master)

Module for agile interservice-communication with support different transports (like as socket). Every service can has many `in` and `out` links. Every link can has many connections by different transport (example, socket-client or socket-server), create another services and environment.


#Example
    import nanoservice from("nanoservice");
    //Add transport with any name
    const transportIPCServer = require("nanoservice-transport-ipc-server");
    class Service1 extends EventEmitter {
        constructor(args){
            super();
            this.on("in1", (data)=>{
                setTimeout(()=>{
                    this.emit("test1");
                }, 100);
            });
        }
    }
    // Create transport
    const transport = transportIPCServer({
        address: "sock"
    });
    // Define links
    // All calls to out1 will be transported to ipc-server with address "sock" on emit-name "event1" 
    const links = [
            {
                transport: transport,
                type: "out",
                name: "out1",
                to: "event1"
            }
        ];
    const config = { links };
    nanoservice(service, config)

#Transports

Internal transport: https://github.com/arvitaly/nanoservice-transport-internal

IPC transports: https://github.com/arvitaly/nanoservice-transport-ipc-client, https://github.com/arvitaly/nanoservice-transport-ipc-server

