(function () {

    angular
        .module('users')
        .controller('UserController', [
            'userService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
            UserController
        ]);

    /**
     * Main Controller for the Angular Material Starter App
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function UserController(userService, $mdSidenav, $mdBottomSheet, $log, $q) {
        var self = this;

        self.selected = null;
        self.developers = [];
        self.components = [];
        self.toggleUser = toggleUser;

        self.selectedDevelopers = [];
        self.selectedComponents = [];
        self.selectUniqueDeveloper = selectUniqueDeveloper;

        self.searchForAutoComplete = function ( input, collection ) {
          return collection.filter( function(element ) {
              return angular.lowercase(element.name).indexOf(angular.lowercase(input)) >= 0;
          });
        };

        self.developerChips = [];
        self.transformChip = function(chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                chip.isSelected = true;
                return chip;
            }

            // Otherwise, create a new one
            return { name: chip, type: 'new' }
        };

        self.selectDeveloper = function( developer ) {
            if ( developer ) {
                developer.isSelected = true;
                self.selectedDevelopers = [developer];
            } else {
                self.selectedDevelopers = [];
            }
        };


        // Load all registered users

        userService
            .getFacets()
            .then(function (facets) {
                console.log("the promise should have resolved and I should have users");
                self.developers = [].concat(facets.developers);
                self.selected = self.developers[0];
                self.components = [].concat(facets.components);
            })
            .then(userService.applyFacets({
                authors: getSelectedDevelopers(),
                components: getSelectedComponents()
            }));

        // *********************************
        // Internal methods
        // *********************************

        function toggleUser(user, state) {
            console.log("toggleUser: " + user.name);
            console.log(user);
            console.log(state);
            if (state) {
                user.isSelected = state.value;
            }
            if (user.isSelected) {
                self.selectedDevelopers = self.selectedDevelopers.filter( function(dev) {
                    return dev.name !== user.name;
                });
                self.selectedDevelopers.push(user);
            } else {
                self.selectedDevelopers = self.selectedDevelopers.filter( function(dev) {
                   return dev.name !== user.name;
                });
            };

            self.developers.forEach( function(developer) {
                if ( self.selectedDevelopers.filter( function (dev) {
                        return dev.name === developer.name;
                    }).length > 0 ) {
                    developer.isSelected = true;
                } else {
                    developer.isSelected = false;
                }
            });

            userService.applyFacets({
                authors: getSelectedDevelopers(),
                components: getSelectedComponents()
            }).then(function (result) {
                console.log(result);
            }, function (reason) {
                console.log(reason);
            });
        };

        function selectUniqueDeveloper(developer) {
            console.log("selectUniqueDeveloper");
            console.log(developer);
            if (developer) {
                console.log("setting selection to " + developer.name);
                developer.isSelected = true;
                self.selectedDevelopers = [developer];
                console.log(self.selectedDevelopers);
                console.log(self.selectedDevelopers.length);
            } else {
                console.log("setting selection to empty array");
                self.selectedDevelopers = [];
                self.developers.forEach( function(dev) {dev.isSelected = false;} );
                console.log(self.selectedDevelopers);
                console.log(self.selectedDevelopers.length);
            }
        }

        function getSelectedDevelopers() {
            return self.developers.filter(function (developer) {
                return developer.isSelected
            }).map(function (developer) {
                return developer.name;
            });
        };

        function getSelectedComponents() {
            return self.components.filter(function (component) {
                return component.isSelected
            }).map(function (component) {
                return component.name;
            });
        };


    }

})();
