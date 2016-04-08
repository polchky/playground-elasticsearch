var Feature = require('./feature').Feature;
var Component = require('./component').Component;
var CodeUnit = require('./codeUnit').CodeUnit;
var UnitTest = require('./unitTest').UnitTest;
var createBusinessObjectType = require('./businessObject').createBusinessObjectType;


function CodeBase(reporter) {
    this.reporter = reporter;
};

CodeBase.prototype.createNewFeature = function (description, size) {
    new Feature(description, size);
};

CodeBase.prototype.makeProgressOnFeature = function (feature, developer) {

    var teamFixesBugsBeforeWritingNewCode = false;

    /**
     * It is a good practice to start by fixing bugs, before developing new code
     *
     */
    if (teamFixesBugsBeforeWritingNewCode) {
        var codeToFix = CodeUnit.pick(1, function (codeUnit) {
            return codeUnit.correctness < 100;
        });
        if (codeToFix[0]) {
            console.log("fixing broken code for code unit: " + codeToFix[0].id);
            codeToFix[0].correctness = Math.min(100, codeToFix[0].correctness + 10);
            return;
        }
    };

    /**
     * If all buggy code has been fixed, we can make progress on the functionality
     */
    var feature = feature || Feature.pick(1)[0] || new Feature();
    console.log("making progress on feature: " + feature.id);
    if (feature.progress < 100) {
        var delta = Math.floor(Math.random() * 30 + 5);
        feature.progress = Math.min(100, feature.progress + delta);

        var deltaCorrectness = 100 - ( Math.floor(Math.random() * (1000 - developer.abilityToWriteCorrectCode * 10)));
        feature.correctness = Math.max(Math.min(100, feature.correctness + deltaCorrectness), 0);

        /*
         * We add some code units that will created during this increment
         */
        var numberOfCodeUnits = Math.floor(Math.random() * 5 + 1);
        for (var i = 0; i < numberOfCodeUnits; i++) {
            var codeUnit = new CodeUnit(feature, undefined, developer);
            //var deltaCorrectness = 100 - ( Math.floor(Math.random() * (1000 - developer.abilityToWriteCorrectCode * 10)));
            codeUnit.correctness = Math.max(Math.min(100, 100 - Math.random() * (100 - developer.abilityToWriteCorrectCode)), 0);

            /*
             * We add some unit tests
             */
            var numberOfUnitTests = Math.floor(Math.random() * developer.abilityToWriteUnitTests);
            for (var i = 0; i < numberOfUnitTests; i++) {
                new UnitTest(codeUnit, feature, developer);
            }
        }
    }
};

CodeBase.prototype.dump = function () {
    console.log("------------------------------------------------------------");
    console.log("Code base facts");
    console.log("------------------------------------------------------------");
    console.log("Number of features: " + Feature.instances.length);
    console.log("Number of components: " + Component.instances.length);
    console.log("Number of code units: " + CodeUnit.instances.length);
    console.log("Number of unit tests: " + UnitTest.instances.length);
    console.log("------------------------------------------------------------");
    Component.instances.forEach(function (component) {
        console.log(component.id + " : " + component.codeUnits.length + " code units.");
    });
    Feature.instances.forEach(function (feature) {
        console.log(feature.id + " : " + feature.description + ". Completion: " + feature.progress + "%. Unit tests: " + feature.unitTests.length);
    });

};

CodeBase.prototype.build = function (date) {
    console.log("------------------------------------------------------------");
    console.log("Building code base");
    console.log("------------------------------------------------------------");
    var numberOfSuccesses = 0;
    var numberOfFailures = 0;

    var that = this;

    Component.instances.forEach(function (component) {
        //console.log("Building component " + component.name);
        component.codeUnits.forEach(function (codeUnit) {
            //console.log("  Building code unit " + codeUnit.id);
            codeUnit.unitTests.forEach(function (unitTest) {
                //console.log("    Running unit test " + unitTest.id);
                var success = !(Math.random() > codeUnit.correctness / 100);
                var unitTestResult = {
                    date: date,
                    unitTestId: unitTest.id,
                    author: unitTest.developer.firstName + " " + unitTest.developer.lastName,
                    codeUnitId: codeUnit.id,
                    component: component.name,
                    success: success
                };
                that.reporter.reportUnitTestResult(unitTestResult).then(function (success) {
                }, function (error) {
                    console.log("Could not report unit test result: " + error);
                });

                if (success) {
                    numberOfSuccesses++;
                } else {
                    numberOfFailures++;
                }

            });
        });
    });

    /*
     Feature.instances.forEach(function (feature) {
     //console.log("Running unit tests for feature " + feature.id + " : " + feature.description);
     feature.unitTests.forEach(function (unitTest) {
     //console.log("-> " + unitTest.id);
     var success = !(Math.random() > feature.correctness / 100);

     var unitTestResult = {
     date: date,
     unitTestId: unitTest.id,
     developer: unitTest.developer.firstName + " " + unitTest.developer.lastName,
     featureId: unitTest.feature.id,
     success: success
     };

     that.reporter.reportUnitTestResult(unitTestResult).then(function (success) {
     //console.log("unit test result indexed");
     }, function (error) {
     console.log("Could not report unit test result: " + error);
     });

     if (success) {
     numberOfSuccesses++;
     } else {
     numberOfFailures++;
     }
     });
     });
     */
    console.log("Done. Number of successful tests: " + numberOfSuccesses + ". Number of failed tests: " + numberOfFailures);
    var testRun = {
        date: date,
        numberOfSuccesses: numberOfSuccesses,
        numberOfFailures: numberOfFailures
    };
    this.reporter.reportTestRun(testRun).then(function (success) {

    }, function (error) {
        console.log("could not index test run: " + error);
    });

    var stats = {
        date: date,
        numberOfFeatures: Feature.instances.length,
        numberOfComponents: Component.instances.length,
        numberOfCodeUnits: CodeUnit.instances.length,
        numberOfUnitTests: UnitTest.instances.length,
        features: Feature.instances.map(function (feature) {
            return {
                featureId: feature.id,
                progress: feature.progress
            }
        }),
        codeUnits: CodeUnit.instances.map(function (codeUnit) {
            return {
                codeUnitId: codeUnit.id,
                component: codeUnit.component.name,
                contributors: codeUnit.contributors.map(function (contributor) {
                    return contributor.id;
                }),
                unitTests: codeUnit.unitTests.map(function (unitTest) {
                    return unitTest.id;
                })
            }
        })
    };
    this.reporter.reportCodeBaseStats(stats);

};

exports.CodeBase = CodeBase;