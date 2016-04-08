(function () {
    'use strict';

    angular.module('users')
        .service('userService', ['$q', 'elastic', UserService]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */
    function UserService($q, elastic) {

        var unitTestResults = [];

        function getFacets() {
            var developers = [];
            var components = [];

            return elastic.search({
                index: 'probedock',
                body: {
                    size: 0,
                    query: {
                        filtered: {
                            query: {
                                type: {
                                    value: "unitTestResult"
                                }
                            },
                            filter: {
                            }
                        }
                    },
                    aggs: {
                        "developers": {
                            "terms": {
                                "field": "author"
                            }
                        },
                        "components": {
                            "terms": {
                                "field": "component.raw",
                                "size": 5
                            }
                        }
                    }
                }
            }).then(function (response) {
                var names = response.aggregations.developers.buckets;
                for (var i = 0; i < names.length; i++) {
                    developers.push({
                        name: names[i].key,
                        count: names[i].doc_count
                    });
                };

                var cs = response.aggregations.components.buckets;
                for (var i = 0; i < cs.length; i++) {
                    components.push({
                        name: cs[i].key,
                        count: cs[i].doc_count
                    });
                }

                return {
                    developers: developers,
                    components: components
                };
            })
        }

        function applyFacets( facets ) {
            var results = [];
            var filters = [];

            if (facets.authors && facets.authors.length !== 0) {
                filters.push({
                    terms : {
                        author: facets.authors
                    }
                });
            };

            if (facets.components && facets.components.length !== 0) {
                filters.push({
                    terms : {
                        "component.raw": facets.components
                    }
                });
            };

            return elastic.search({
                index: 'probedock',
                body: {
                    size: 0,
                    query: {
                        filtered: {
                            query: {
                                type: {
                                    value: "unitTestResult"
                                }
                            },
                            filter: {
                                bool : {
                                    filter : filters
                                }
                            }
                        }
                    },
                    aggs: {
                        "results": {
                            "terms": {
                                "field": "success"
                            }
                        }
                    }
                }
            }).then(function (response) {
                var r = response.aggregations.results.buckets;
                for (var i = 0; i < r.length; i++) {
                    results.push({
                        status: r[i].key === 1 ? 'success' : 'failure',
                        count: r[i].doc_count
                    });
                };
                unitTestResults.splice(0, unitTestResults.length);
                unitTestResults.push.apply(unitTestResults, results);

                return results;
            });
        }



        return {
            getFacets: function () {
                return getFacets(); // return a promise
            },
            applyFacets: function( facets ) {
                return applyFacets( facets ); // return a promise
            },
            unitTestResults : unitTestResults
        };
    }

})();
