import * as EventEmiiter from 'eventemitter2';
declare namespace Nanoservice {
    export type ITransportClass<T> = (opts: T) => ITransport;
    export interface IOpts {
        transports: { [index: string]: ITransportClass<any> }
    }
    type ITransport = {
        in?: (name: string, cb: (data) => any) => any;
        out?: (name: string) => (data) => any;
    }
    type NanoserviceFactory<T> = (service: IService<T>, config: IServiceConfig<T>) => Nanoservice;
    interface Nanoservice extends EventEmiiter.EventEmitter2.emitter {
        links: Array<ILink>;
    }
    type IService<T> = (opts: IServiceOpts<T>) => any;
    type IServiceOpts<T> = {
        args: T;
        out: (name: string, data: any) => any;
        env: (name: string) => any;
    }
    type ILink = {
        transport: string;
        type: "in" | "out";
        name: string;
        to: string;
    }
    type IServiceConfig<T> = {
        transports?: { [index: string]: IServiceTransport };
        links?: Array<ILink>;
        args?: T;
        env?: { [index: string]: any };
    }
    type IServiceTransport = {
        opts: any;
        type: string;
    }
}
declare function Nanoservice(opts: Nanoservice.IOpts): Nanoservice.NanoserviceFactory<any>;
export = Nanoservice;