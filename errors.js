var code = 0;
module.exports = {
    unknownTransportType: (type, opts) => {
        return {
            message: "Unknown listen type " + type,
            code: ++code,
            type: type,
            options: opts
        }
    }
}