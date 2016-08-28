var code = 0;
module.exports = {
    unknownService: (name/*:string*/, config/*:{}*/) => {
        return {
            message: "Unknown service " + name,
            code: ++code,
            config: config
        }
    }
}
