// @flow
var nanoservice = require('./../index');
describe("Internal communication", () => {
    it("in", () => {
        var fixture1 = "data1";
        var test;
        var e = nanoservice({
            in: {
                in1: (data) => {
                    test = data;
                }
            }
        })
        e.emit("in1", fixture1);
        expect(test).toBe(fixture1);
    })
    it("out", (done) => {
        var fixture2 = "data2";
        var count = 0;
        var test;
        var e = nanoservice({
            out: {
                out1: (callback) => {
                    callback(fixture2);
                    setTimeout(() => {
                        callback(fixture2);
                    }, 10)
                }
            }
        })
        e.on("out1", (data) => {
            test = data
            expect(test).toBe(fixture2);
            count++;
        })
        setTimeout(() => {
            expect(count).toBe(2);
            done();
        }, 20)
    })
})