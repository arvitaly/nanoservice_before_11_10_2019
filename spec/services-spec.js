var ServiceController = require('./../services');
var fixture1 = "fix1";
var fixture2 = "fix2";
var fixture3 = "fix3";
var fixture4 = "fix4";
describe("Service controller", () => {
    var serviceController;
    var service2Class;
    var onRemoved;
    var remove;
    var emit;
    beforeEach(() => {
        service2Class = jasmine.createSpy();
        onRemoved = jasmine.createSpy();
        remove = jasmine.createSpy();
        emit = jasmine.createSpy();
        //Create service by class
        service2Class.and.returnValue({
            onRemoved: onRemoved,
            remove: remove,
            emit: emit
        })
        serviceController = ServiceController({ "service2Class": service2Class });
    })
    it("when add sub-service, class should be called", () => {
        serviceController.add({
            id: "id1",
            type: "service2Class",
            args: fixture1,
            transports: fixture2,
            links: fixture3,
            on: fixture4
        });
        expect(service2Class.calls.allArgs()).toEqual([[{
            args: fixture1,
            transports: fixture2,
            links: fixture3
        }]])
    })
    it("when add sub-services with single ID, should be created only one", () => {
        serviceController.add({
            id: "id1",
            type: "service2Class"
        })
        serviceController.add({
            id: "id1",
            type: "service2Class"
        })
        expect(service2Class.calls.count()).toBe(1);
    })
    it("when service call onRemoved, should created again", () => {
        serviceController.add({
            id: "id1",
            type: "service2Class"
        });
        expect(onRemoved.calls.count()).toBe(1);
        //Call onremoved-callback
        onRemoved.calls.argsFor(0)[0]();
        expect(service2Class.calls.count()).toBe(2);
    })
    it("when service remove, should call real service remove and can add service with this id", () => {
        serviceController.add({
            id: "id1",
            type: "service2Class"
        });
        serviceController.remove("id1");
        expect(remove.calls.allArgs()).toEqual([[]]);
        serviceController.add({
            id: "id1",
            type: "service2Class"
        });
        expect(service2Class.calls.count()).toBe(2);
    })
    it("when service remove, if it not exists, should do nothing", () => {
        serviceController.remove("id1");
        expect(remove.calls.count()).toBe(0);
    })
    it("when call remove all, should be call remove for all services", () => {
        serviceController.add({
            id: "id1",
            type: "service2Class"
        });
        serviceController.add({
            id: "id2",
            type: "service2Class"
        });
        serviceController.removeAll();
        expect(remove.calls.count()).toBe(2);
    })
    it("when setted, old services should be removed, new - added", () => {
        var service1 = {
            id: "id1",
            type: "service2Class"
        };
        var service2 = {
            id: "id2",
            type: "service2Class"
        };
        var service3 = {
            id: "id3",
            type: "service2Class"
        };
        serviceController.add(service1);
        serviceController.add(service2);
        serviceController.set([service1, service3]);
        expect(service2Class.calls.count()).toBe(3);
        expect(remove.calls.allArgs()).toEqual([[]]);
    })
})