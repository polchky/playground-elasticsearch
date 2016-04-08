angular.module('probedock', ['elasticsearch'])

    .service('es', function (esFactory) {
        return esFactory({
            host: 'localhost:9200'
        });

    })

    .controller('mainController', function ($scope, es) {
        $scope.message = "hello";

        es.search({
            index: 'probedock',
            body: {
                size: 0,
                query: {
                    query_string: {
                        "default_field" : "author.lastName",
                        "query": "LiEChti"
                    }
                },
                aggs: {
                    "lastNames": {
                        "terms": {
                            "field": "author.lastName",
                            "size": 6
                        }
                    },
                    "firstNames": {
                        "terms": {
                            "field": "author.firstName",
                            "size": 6
                        }
                    }

                }
            }
        }, function (error, response) {
            if (error) {
                $scope.message = error;
            } else {
                $scope.message = "Last names: ";
                for (var i = 0; i < response.aggregations.firstNames.buckets.length; i++) {
                    $scope.message += response.aggregations.firstNames.buckets[i].key + " (" + response.aggregations.firstNames.buckets[i].doc_count + "), ";
                }
            }
        });
    });
