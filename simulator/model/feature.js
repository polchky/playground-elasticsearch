var UnitTest = require('./unitTest').UnitTest;
var Component = require('./component').Component;
var createBusinessObjectType = require('./businessObject').createBusinessObjectType;
var pad = require('pad');
var util = require('util');
var Chance = require('chance');

var chance = new Chance();

/**
 *
 * @constructor
 */
function Feature( description, size, components, reporter) {

    this.description = description;

    this.size = size || 50; // 0..100

    this.progress = 0; // 0..100

    this.correctness = Math.floor(Math.random() * 100); // 0..100

    this.stability = 100; // 0..100

    this.contributors = [];

    /*
     * Initially, there is not unit test.
     */
    this.unitTests = [];

    /*
     * Pick a random number of components that will require some work in order to implement
     * the feature.
     */
    if (Array.isArray(components)) {
        this.impactedComponents = components.slice(0);
    } else {
        this.impactedComponents = Component.pick();
    }

    this.reporter = reporter;
}

var Feature = createBusinessObjectType(Feature);

Feature.prototype.addUnitTest = function() {
    var unitTest = new UnitTest(this);
    this.reporter.reportUnitTest(unitTest.simplify());
    this.unitTests.push( unitTest );
};

Feature.prototype.addImpactedComponents = function( impactedComponent ) {
    this.impactedComponents.push( impactedComponent );
};

Feature.prototype.dump = function() {
    console.log("Feature: " + this.id);

    this.unitTests.forEach( function( unitTest ) {
        unitTest.dump();
    });

};

Feature.pickInProgressFeature = function() {
    var candidates = [];
    Feature.instances.forEach( function( feature ) {
       if (feature.progress < 100) {
           candidates.push(feature);
       }
    });
    if (candidates.length == 0) {
        return undefined;
    }
    return chance.pick(candidates);
}

Feature.prototype.simplify = function() {
    return {
        id: this.id,
        description: this.description
    }
}

exports.Feature = Feature;
