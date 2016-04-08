(function(){
    'use strict';

    // Prepare the 'users' module for subsequent registration of controllers and delegates
    angular.module('elastic', [ 'elasticsearch']);

    angular.module('elastic')
        .factory('elastic', function (esFactory) {
            return esFactory({
                host: 'localhost:9200'
            });
        });

})();
