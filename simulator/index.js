var moment = require('moment');

var Simulator = require('./simulator/simulator').Simulator;
var Feature = require('./model/feature').Feature;
var Component = require('./model/component').Component;
var CodeBase = require('./model/codebase').CodeBase;
var Developer = require('./model/developer').Developer;

var Reporter = require('./reporter/elasticSearchReporter').Reporter;
var reporter = new Reporter();
var codeBase = new CodeBase(reporter);

var Chance = require('chance');
var chance = new Chance();


/*
 * Let's create a simulator. We will simulate a period that starts now and ends in
 * one month.
 */
var simulator = new Simulator(moment(), moment().add(1, "months"));
console.log("Simulator created, it is now: " + simulator.getSimulatorTime());


var getTaskEndTimeBasedOnBusinessHours = function (startTime, hours) {
    var now = moment(startTime);
    var remainingHoursToday = Math.min(18 - now.hour() - 1);
    if (remainingHoursToday >= hours) {
        now.add(hours, 'hours');
        return now;
    } else {
        var numberOfDays = Math.floor((hours - remainingHoursToday) / 8);
        var remainingHoursOnTheLastDay = hours - remainingHoursToday - (numberOfDays * 8);
        now.add(numberOfDays + 1, 'days');
        now.minute(0);
        now.hour(9 + remainingHoursOnTheLastDay, 'hours');
        return now;
    }
};


new Component("Web front-end");
new Component("REST API");
new Component("Business layer");
new Component("iOS app");
new Component("android app");

simulator.schedule('reportComponents', Component.instances);

new Feature("Login", null, null, reporter);
new Feature("Logout", null, null, reporter);
new Feature("Register", null, null, reporter);
new Feature("Edit profile", null, null, reporter);
new Feature("Reset password", null, null, reporter);
new Feature("Search for product", null, null, reporter);
new Feature("Search full text", null, null, reporter);
new Feature("Put product in cart", null, null, reporter);
new Feature("Checkout", null, null, reporter);
new Feature("Pay with credit card", null, null, reporter);
new Feature("Rate product", null, null, reporter);

simulator.schedule('reportFeatures', Feature.instances)

var d = new Developer();
d.firstName = "Serious";
d.lastName = "Coder";
d.abilityToWriteCorrectCode = 100;
d.abilityToWriteUnitTests = 100;
simulator.schedule('hireNewDeveloper', d);

d = new Developer();
d.firstName = "Bad";
d.lastName = "Coder";
d.abilityToWriteCorrectCode = 30;
d.abilityToWriteUnitTests = 10;
simulator.schedule('hireNewDeveloper', d);

d = new Developer();
d.firstName = "Lucky";
d.lastName = "Coder";
d.abilityToWriteCorrectCode = 90;
d.abilityToWriteUnitTests = 10;
simulator.schedule('hireNewDeveloper', d);

for (var i = 0; i < 3; i++) {
    simulator.schedule('hireNewDeveloper');
}

simulator.schedule('dailyBuild', {});

simulator.on('reportComponents', function (components) {
    components.forEach((component) => {
        reporter.reportComponent(component.simplify());
    });
});


simulator.on('reportFeatures', function (features) {
    features.forEach((feature) => {
        reporter.reportFeature(feature.simplify());
    });
});

simulator.on('hireNewDeveloper', function (event) {
    var developer = event || new Developer();
    reporter.reportNewDeveloper(developer);
    simulator.schedule('makeProgressOnFeature', {developer: developer});
});

simulator.on('newSprint', function (event) {
    console.log("-> Starting new sprint");
    for (var i = 0; i < 10; i++) {
        var time = simulator.getSimulatorTime().add(i + 1, "days");
        console.log("scheduling dailyBuild on " + time.format());
        simulator.schedule('dailyBuild', {}, time);
    }
});

simulator.on('newFeature', function (event) {
});

simulator.on('makeProgressOnFeature', function (event) {
    var feature = Feature.pick( 1, function( feature ) {
            if (feature.progress >= 100) {
                //console.log("feature already done, skip.");
                return false;
            }
            if (feature.contributors.indexOf(event.developer) != -1) {
                //console.log("feature in progress, already owned: select");
                return true;
            }
            if (feature.contributors.length == 0) {
                //console.log("feature without any contributor: select");
                feature.contributors.push(event.developer);
                return true;
            }

            return false;

        } )[0];
    if(!feature) {
        feature = new Feature(chance.sentence({words: 2}));
        reporter.reportFeature(feature.simplify());
    }

    codeBase.makeProgressOnFeature(feature, event.developer, simulator.getSimulatorTime());
    var numberOfHoursToMakeProgress = Math.floor(Math.random() * 16 + 1);
    simulator.schedule('makeProgressOnFeature', {developer: event.developer}, getTaskEndTimeBasedOnBusinessHours(simulator.getSimulatorTime(), numberOfHoursToMakeProgress));
});

simulator.on('dailyBuild', function (event) {
    console.log("-> Daily build.");
    codeBase.dump();
    codeBase.build(simulator.getSimulatorTime().format());
    var time = simulator.getSimulatorTime().add(1, "days");
    console.log("scheduling next dailyBuild on " + time.format());
    simulator.schedule('dailyBuild', {}, time);
});


/*
 * This is the entry point. We start by setting up elastic search (delete and recreate the index). On this is done,
 * we start the simulation.
 */
reporter.setupElasticSearch()
    .then(function (success) {
        console.log("Elastic Search has been setup, starting simulation.");
        simulator.start();
        return "Simulation successfully completed.";
        console.log("Simulation done.");
    }, function (error) {
        console.log("Problem setting up elastic search: " + error);
        console.log(error.stack);
    })
    .catch(function (e) {
        console.log("catch: " + e);
        console.log(e.stack);
    });
