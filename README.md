#NanoService

[![npm version](https://badge.fury.io/js/nanoservice.svg)](https://badge.fury.io/js/nanoservice)
[![Build Status](https://travis-ci.org/arvitaly/nanoservice.svg?branch=master)](https://travis-ci.org/arvitaly/nanoservice)
[![Coverage Status](https://coveralls.io/repos/github/arvitaly/nanoservice/badge.svg?branch=master)](https://coveralls.io/github/arvitaly/nanoservice?branch=master)

Module for agile interservice-communication with support different transports (like as socket). Every service can has many `in` and `out` links. Every link can has many connections by different transport (example, socket-client or socket-server), create another services and environment.


#Example
    var Nanoservice = require('nanoservice');
    //Add transport with any name
    var nanoservice = Nanoservice({'ipc-server': require('nanoservice-transport-ipc-server')});
    var service = ({args, out, services, env})=>{
        return {
            //income link
            in1: (data)=>{
                setTimeout(()=>{
                    //call out-link 
                    out.out1("test" + env("env1"));
                    //Create sub-service by services model, services can be add, set, remove, removeAll
                    services.set({
                        id: "id1",
                        type: "service2Class",
                        args: "argument",
                        transports: {},
                        links: [],
                        on: {
                            subout1: ()=>{}
                        }
                    })
                }, 100)
            }
        }
    }
    var config = {
        env={
            env1: "envValue"
        },
        transports: {
            tr1: {
                opts: {
                    address: "sock"
                },
                type: "ipc-server"
            }
        },
        //All calls to out1 will be transported to ipc-server with address "sock" on emit-name "event1" 
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

Internal transport: https://github.com/arvitaly/nanoservice-transport-internal

IPC transports: https://github.com/arvitaly/nanoservice-transport-ipc-client, https://github.com/arvitaly/nanoservice-transport-ipc-server

#Event-emitter using

Inside process, you can use nanoservice like as simple event-emitter.

    var e = nanoservice(...);
    e.on("out1",()=>{});
    e.emit("in1", "data");
