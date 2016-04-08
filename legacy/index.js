var elasticsearch = require('elasticsearch');
var Chance = require('chance');

var chance = new Chance();

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    //log: 'trace'
});


var developers = [];
generateDevelopers(developers, 20);


function handleError(error) {
    console.log("Error: " + JSON.stringify(error, null, 4));
}

deleteIndex()
    .then(createIndex, handleError)
    .then(addAnalyzer, handleError)
    .then(addMapping, handleError)
    .then(generateTestRuns, handleError)
    .then(function (data) {

    }, function (error) {
        console.log("error: " + error);
    });

function generateTestRuns(data) {
    console.log('data: ' + JSON.stringify(data, null, 4));
    for (var i = 0; i < 100; i++) {
        var testRun = {
            author: pickDeveloper(),
            date: new Date(),
            successes: Math.floor(Math.random() * 100),
            failures: Math.floor(Math.random() * 100)
        };

        client.index({
            index: 'probedock',
            type: 'testRun',
            body: testRun,
        }, function (error, response) {
            if (error) {
                console.log("Error while indexing document: " + error);
            } else {
                //console.log("Document added to index: " + response);
            }
        });
    };
}

function pickDeveloper() {
    return developers[Math.floor(Math.random() * developers.length)];
}

function generateDevelopers(developers, numberOfDevelopers) {
    for (var i = 0; i < numberOfDevelopers; i++) {
        developers.push({
            firstName: chance.first(),
            lastName: chance.last()
        });
    }
    developers.push({
        firstName: 'Olivier',
        lastName: 'Liechti'
    });
    developers.push({
        firstName: 'Sacha',
        lastName: 'Liechti'
    });
}


function deleteIndex() {
    return client.indices.delete({
        index: 'probedock'
    })
}

function createIndex() {
    console.log("Creating index");
    return client.indices.create({
        index: 'probedock'
    });
}


function addAnalyzer() {
    console.log("Adding analyzer");
    return refreshIndex()
        .then(closeIndex)
        .then(putSettings)
        .then(openIndex);
}

function addMapping() {
    console.log("Adding mapping");
    var mapping = {
        testRun: {
            properties: {
                author: {
                    properties: {
                        firstName: {type: 'string', index: 'not_analyzed'},
                        lastName: {type: 'string', analyzer: "case_insensitive_keyword_analyzer"}
                    }
                }
            }
        }
    };
    return client.indices.putMapping({
        index: 'probedock',
        type: 'testRun',
        body: mapping
    });
}

function putSettings( data ) {
    console.log("putSettings: " + JSON.stringify(data, null, 4));
    var settings = {
        settings: {
            analysis: {
                analyzer: {
                    case_insensitive_keyword_analyzer: {
                        type: "custom",
                        tokenizer: "keyword",
                        filter: "lowercase"
                    }
                }
            }
        }
    };
    return client.indices.putSettings({
        index: 'probedock',
        body: settings
    })}

function refreshIndex( data ) {
    console.log("refresh: " + JSON.stringify(data, null, 4));
    return client.indices.refresh({
        index: 'probedock'
    });
}

function openIndex( data ) {
    console.log("open: " + JSON.stringify(data, null, 4));
    return client.indices.open({
        index: 'probedock'
    });
}

function closeIndex( data ) {
    console.log("close: " + JSON.stringify(data, null, 4));
    return client.indices.close({
        index: 'probedock'
    });
}