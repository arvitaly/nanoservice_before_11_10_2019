// @flow
var code = 0;
module.exports = {
    unknownTransportType: (type/*:string*/, opts/*:{}*/) => {
        return {
            message: "Unknown listen type " + type,
            code: ++code,
            transport: opts
        }
    },
    unknownService: (name/*:string*/, config/*:{}*/) => {
        return {
            message: "Unknown service " + name,
            config: config
        }
    }
}
