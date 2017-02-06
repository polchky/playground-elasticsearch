var elasticsearch = require('elasticsearch');

var indexName = 'probedock';

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    timeout: 600000,
    requestTimeout: 600000,
    //log: 'trace'
});

function Reporter() {
};


Reporter.prototype.reportNewDeveloper = function (developer) {
    console.log("report new developer");
    return client.index({
        index: indexName,
        type: 'developer',
        body: developer,
    });
};

Reporter.prototype.reportTestRun = function (testRun) {
    console.log("report test run");
    return client.index({
        index: indexName,
        type: 'testRun',
        body: testRun,
    });
};

Reporter.prototype.reportUnitTestResult = function (unitTestResult) {
    //console.log("report unit test");
    return client.index({
        index: indexName,
        type: 'unitTestResult',
        body: unitTestResult
    });
};

Reporter.prototype.reportCodeBaseStats = function (codeBaseStats) {
    return client.index({
        index: indexName,
        type: 'codeBaseStats',
        body: codeBaseStats
    });
};

Reporter.prototype.reportComponent = function (component) {
    return client.index({
        index: indexName,
        type: 'component',
        body: component
    });
};

Reporter.prototype.reportUnitTest = function (unitTest) {
    return client.index({
        index: indexName,
        type: 'unitTest',
        body: unitTest
    });
};

Reporter.prototype.reportFeature = function (feature) {
    return client.index({
        index: indexName,
        type: 'feature',
        body: feature
    });
};

Reporter.prototype.reportCodeUnit = function (codeUnit) {
    return client.index({
        index: indexName,
        type: 'codeUnit',
        body: codeUnit
    });
};

Reporter.prototype.setupElasticSearch = function () {

    return deleteIndex(indexName)()
        .then(createIndex(indexName), createIndex(indexName))
        .then(function (success) {
            console.log("Setup done: " + success);
        }, function (reason) {
            console.log("Setup failed: " + reason);
        });

};

var deleteIndex = function (name) {
    return function () {
        return client.indices.delete({
            index: name
        })
    }
};

var createIndex = function (name) {
    return function () {
        return client.indices.create({
            index: name,
            body: {
                mappings: {
                    unitTestResult: {
                        properties: {
                            author: {
                                type: 'string',
                                index: 'not_analyzed'
                            },
                            component: {
                                type: 'string',
                                fields: {
                                    raw: {
                                        type: "string",
                                        index: "not_analyzed"
                                    }
                                }
                            }
                        }
                    },
                    codeBaseStats: {

                    },
                    testRun: {
                    },
                    feature: {
                    },
                    component: {
                    },
                    unitTest: {
                    },
                    codeUnit: {
                    }
                }
            }
        })
    }
};

exports.Reporter = Reporter;
