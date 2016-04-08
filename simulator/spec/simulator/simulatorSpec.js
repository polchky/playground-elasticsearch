var Simulator = require('../../simulator/simulator').Simulator;
var moment = require('moment');

describe("Simulator", function() {

    it("should provide a constructor accepting an argument for the current time", function() {
        var now = moment();
        var simulator = new Simulator( now );
        expect(simulator.getSimulatorTime()).toEqual(now);
    });

    it("should advance simulation time when processing events", function() {
        var simulator = new Simulator(moment('2016-01-01'));
        simulator.schedule('anEvent', {}, moment('2016-01-14'));
        simulator.start();
        expect(simulator.getSimulatorTime()).toEqual(moment('2016-01-14'));
    });

    it("should provide a constructor allowing the client to specify an end time for the simulation", function() {
        var start = moment("2016-01-01");
        var end = moment("2016-02-14");
        var withinBoundariesTime = moment("2016-01-31");
        var tooLateTime = moment("2016-02-17");

        var markers = [];
        var simulationSuccessful = false;
        var simulator = new Simulator(start, end);
        simulator.on("testEvent", function( e ) {
            markers.push(e);
        });
        simulator.schedule("testEvent", {}, withinBoundariesTime);
        simulator.schedule("testEvent", {}, tooLateTime);

        var result = simulator.start();
        console.log("end: " + result);
        expect(markers.length).toBe(1);
    });

    it("should process events in order", function() {
        var start = moment("2016-01-01");
        var t1 = moment("2016-01-10");
        var t2 = moment("2016-02-23");
        var t3 = moment("2016-02-25");
        var t4 = moment("2017-01-01");

        var markers = [];
        var simulator = new Simulator();
        simulator.schedule("testEvent", { e: 3 }, t3);
        simulator.schedule("testEvent", { e: 1 }, t1);
        simulator.schedule("testEvent", { e: 4 }, t4);
        simulator.schedule("testEvent", { e: 2 }, t2);

        simulator.on("testEvent", function( e ) {
            markers.push(e);
        });

        simulator.start();
        expect(markers.length).toBe(4);
        for (var i=1; i<5; i++) {
            expect(markers[i-1].e).toBe(i);
        }

    })

});