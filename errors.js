var code = 0;
module.exports = {
    unknownTransportType: (type, opts) => {
        return {
            message: "Unknown transport type:: " + type,
            code: ++code,
            transport: opts
        }
    }
}
