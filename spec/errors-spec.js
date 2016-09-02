var errors = require('./../errors')
describe("Errors", () => {
    it("unknown error type", () => {
        expect(errors.unknownTransportType("test1", "test2")).toEqual({
            message: "Unknown transport type:: test1",
            code: 1,
            transport: "test2"
        })

    })
})