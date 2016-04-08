var Feature = require('../../model/feature').Feature;
var Component = require('../../model/component').Component;

describe("Feature", function () {

    it("should have a list of impacted components", function () {
        var components = [];
        components.push(new Component("front-end"));
        components.push(new Component("back-end"));
        components.push(new Component("mobile"));

        var size = 100;
        var feature = new Feature("my feature", size, components);
        expect(Array.isArray(feature.impactedComponents)).toBe(true);
        expect(feature.impactedComponents.length).toBe(3);
        expect(feature.impactedComponents).toEqual(components);
    });

    it("should get a random list of impacted components if none is specified", function () {
        for (var i = 0; i < 100; i++) {
            new Component();
        };
        var totalNumberOfComponents = 0;
        for (var i = 0; i < 100; i++) {
            var feature = new Feature();
            totalNumberOfComponents += feature.impactedComponents.length;
        };

        expect(totalNumberOfComponents).toBeGreaterThan(0);
        expect(totalNumberOfComponents).toBeLessThan(100 * Component.instances.length);

    });

    it("should have a size from 0 to 100, with a default value of 50", function () {
        var feature = new Feature();
        expect(feature.size).toBe(50);
    });


});