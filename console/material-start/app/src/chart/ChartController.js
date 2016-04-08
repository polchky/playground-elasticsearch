angular.module("probedock")
    .controller("ChartController", function ($scope, userService) {
        var self = this;

        self.unitTestResults = userService.unitTestResults;

        $scope.$watch(angular.bind(self, function () {
            return userService.unitTestResults;
        }), function (newVal, oldVal) {
            self.chartObject.data.rows = self.unitTestResults.map(function (results) {
                return {
                    c: [
                        {v: results.status},
                        {v: results.count}
                    ]
                }
            })
        }, true);

        self.chartObject = {};
        self.chartObject.type = "PieChart";

        self.chartObject.data = {
            "cols": [
                {id: "t", label: "Status", type: "string"},
                {id: "s", label: "Number", type: "number"}
            ],
            "rows": []
        };

        self.chartObject.options = {
            'title': 'Results of Unit Test executions'
        };

        self.update = function () {

        }
    });