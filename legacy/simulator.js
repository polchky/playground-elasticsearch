var emitter = require('events').EventEmitter;
var util = require('util');
var moment = require('moment');
var Chance = require('chance');

var chance = new Chance();


function Simulator() {
    this.developers = [];
    this.features = [];
    this.components = [];
};

util.inherits(Simulator, emitter);
var simulator = new Simulator();

function EventsQueue() {
    var queue = [];
    var now = moment('1972-04-29');

    this.schedule = function (eventType, triggerDate, event) {
        if (triggerDate === null) {
            triggerDate = now;
        }
        queue.push({
            type: eventType,
            date: triggerDate,
            event: event
        });
        queue.sort(function (e1, e2) {
            return e1.date - e2.date;
        });
    };

    this.tick = function () {
        var nextEvent = queue.shift();
        while (nextEvent) {
            if (nextEvent.date != null) {
                now = nextEvent.date;
            }
            simulator.emit(nextEvent.type, nextEvent);
            nextEvent = queue.shift();
        }
    };

    this.now = function() {
        return now;
    }
}
var eventsQueue = new EventsQueue();
eventsQueue.schedule('eventType1', moment('2016-01-12'), {});
eventsQueue.schedule('eventType1', moment('2016-01-03'), {});
eventsQueue.schedule('eventType1', moment('2016-01-02'), {});
eventsQueue.schedule('eventType1', null, {});
eventsQueue.schedule('eventType1', moment('2016-01-06'), {});
eventsQueue.schedule('eventType1', null, {});
eventsQueue.schedule('eventType1', moment('2016-01-01'), {});

simulator.on('eventType1', function (event) {
    console.log("Fired event: " + JSON.stringify(event));
    var rnd = Math.floor(Math.random()*10+1);
    //console.log("rnd: " + rnd);
    if (rnd >= 3) {
        eventsQueue.schedule('eventType1', eventsQueue.now().add(1, "hours"), {});
    }
});

eventsQueue.tick();


function UnitTest(feature, component) {
    this.id = chance.hash({length: 25});
    this.feature = feature;
    this.component = component;
}

function Feature(developer, creationDate) {
    this.id = "F_" + chance.hash({length: 10});
    this.developer = developer;
    this.creationDate = creationDate;

    var numberOfImpactedComponents = Math.floor((Math.random() * simulator.components.length) + 1);
    console.log("number of components for feature: " + numberOfImpactedComponents);
    if (numberOfImpactedComponents === 1) {
        this.components = [(chance.pick(simulator.components))];
    } else {
        this.components = chance.pick(simulator.components, numberOfImpactedComponents);
    }
    this.unitTests = [];
}

function Component(name, technology) {
    this.name = name;
    this.technology = technology;
}

Simulator.prototype.addDeveloper = function (developer) {
    this.developers.push(developer);
    this.emit('newDeveloper', {});
};

Simulator.prototype.addFeature = function (feature) {
    this.features.push(feature);
    this.emit('newFeature', feature);
};

Simulator.prototype.addComponent = function (component) {
    this.components.push(component);
};

simulator.on('newFeature', function (newFeatureEvent) {
    console.log("Implementing new feature: " + newFeatureEvent.id);
    var numberOfUnitTests = Math.random() * 10;
    for (var i = 0; i < numberOfUnitTests; i++) {
        var impactedComponent = chance.pick(newFeatureEvent.components);
        console.log("Feature components: " + newFeatureEvent.components.name);
        console.log("Impacted component for unit test: " + impactedComponent);
        this.emit('newUnitTest', new UnitTest(newFeatureEvent, impactedComponent));
    }
});

simulator.on('newUnitTest', function (newUnitTestEvent) {
    console.log("Implementing new unit test for component " + newUnitTestEvent.component.name + " : " + newUnitTestEvent.id);
    newUnitTestEvent.feature.unitTests.push(newUnitTestEvent);
});

simulator.on('newDay', function (newDayEvent) {
    /*
     * Every day, we start with a daily build
     */
    simulator.emit('startBuild', {buildDate: newDayEvent.date});

    /*
     * Every day, every developer adds one feature to the code base
     */
    simulator.developers.forEach(function (developer) {
        simulator.addFeature(new Feature(developer, newDayEvent));
    });
});

simulator.on('startBuild', function (startBuildEvent) {
    console.log("Starting build pipeline...");
    console.log("Build date: " + startBuildEvent.buildDate.format());
    console.log("Number of features: " + simulator.features.length);
    console.log("Number of components: " + simulator.components.length);
    var numberOfUnitTests = simulator.features.reduce(function (numberOfUnitTests, feature) {
        return numberOfUnitTests + feature.unitTests.length;
    }, 0);
    console.log("Number of unit tests: " + numberOfUnitTests);
    simulator.features.forEach(function (feature) {
        feature.unitTests.forEach(function (unitTest) {
            console.log("---> " + unitTest.id);
        });
    });
});

function setupDevelopers() {
    simulator.addDeveloper({
        id: 'oliechti',
        firstName: "Olivier",
        lastName: "Liechti"
    });

    simulator.addDeveloper({
        id: 'lprevost',
        firstName: "Laurent",
        lastName: "Prévost"
    });

    simulator.addDeveloper({
        id: 'soulevay',
        firstName: "Simon",
        lastName: "Oulevay"
    });
}

function setupComponents() {
    simulator.addComponent(new Component('End-user front-end app', 'javascript'));
    simulator.addComponent(new Component('iOS mobile app', 'Objective-C'));
    simulator.addComponent(new Component('android mobile app', 'android'));
    simulator.addComponent(new Component('REST API', 'java'));
    simulator.addComponent(new Component('Business layer', 'java'));
}

function setup() {
    setupDevelopers();
    setupComponents();
}

setup();

/*
 var day = moment("2016-01-01");
 for (var i=0; i< 100; i++) {
 simulator.emit('newDay', {
 date: day
 });
 day.add(1, 'days');
 }
 */

/*
 simulator.features.forEach( function(feature) {
 console.log("Feature: " + feature.id + " developer by " + feature.developer.id + " with " + feature.unitTests.length + " unit tests.");
 });
 */

/*
 * - A feature is often developed by several developers (feature team)
 * - A feature can involve units in several components (front-end, mobile, etc.)
 * - The team should not work on too many features in parallel
 * - A developer should not commit code that does not pass the commit stage (at least unit tests should pass)
 * - The time required to develop a feature often varies from a couple of hours to a couple of days (more than this is an anti-patterns)
 * - There are more unit tests, than integration tests, than API tests, than automated user acceptance tests
 * - The number of unit tests should be proportional to the size of code of the tested unit
 * - Teams often run a daily build
 * - Teams increasingly start a build at each commit (not on their machine though and this can consume many resources)
 * - A flaky test often changes state (passing, failed)
 * - A feature can be implemented BUT broken
 * - A feature can be in-progress BUT passing
 * - Developers who practice TDD start a feature by implementing unit tests that fail on their machine, and gradually fix them.
 * - Developers who practice BDD start a feature by implementing UAT that fail on their machine, and gradually fix them.
 * - When a bug is reported against a feature, a test should be added to reproduce the failure on the fixer's machine and the unit should be fixed.
 */