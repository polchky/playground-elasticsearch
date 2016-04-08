var createBusinessObjectType = require('../../model/businessObject').createBusinessObjectType;

describe("BusinessObject", function () {

    it("should provide a static function to create a new type of business object", function () {
        function Animal(name, legs) {
            this.name = name;
            this.legs = legs;
        };
        var AugmentedAnimal = createBusinessObjectType(Animal);
        expect(AugmentedAnimal).not.toBe(undefined);
    });

    it("should use a static property to keep track of the number of instances for each type", function () {
        function Animal() {
        };
        var BOAnimal = createBusinessObjectType(Animal);
        expect(BOAnimal.instances.length).toBe(0);
        new BOAnimal();
        expect(BOAnimal.instances.length).toBe(1);
        for (var i = 0; i < 10; i++) {
            new BOAnimal();
            expect(BOAnimal.instances.length).toBe(2 + i);
        }
    });

    it("should give unique id to instances, made of the type name and of a counter for each type", function () {
        function Animal() {
        };
        var BOAnimal = createBusinessObjectType(Animal);
        var a1 = new BOAnimal();
        expect(a1.id).toBe("Animal_00001");
        var a2 = new BOAnimal();
        expect(a2.id).toBe("Animal_00002");
    });

    describe("pick", function () {
        it("should accept an argument 'n' to return an array with 'n' random instances of a given type", function () {
            var Animal = function () {
            };
            Animal = createBusinessObjectType(Animal);
            for (var i = 0; i < 10; i++) {
                new Animal();
            }
            var randomInstances = Animal.pick(1);
            expect(Array.isArray(randomInstances)).toBe(true);
            expect(randomInstances.length).toBe(1);

            for (var i = 0; i < 10; i++) {
                expect(Animal.pick(i).length).toBe(i);
            }
        });

        it("should return an array with a random number of instances is no argument is specified", function () {
            var Animal = function () {
            };
            Animal = createBusinessObjectType(Animal);
            for (var i = 0; i < 10; i++) {
                new Animal();
            }
            var totalNumberOfInstances = 0;
            for (var i = 0; i < 100; i++) {
                totalNumberOfInstances += Animal.pick().length;
            }

            expect(totalNumberOfInstances).toBeGreaterThan(0);
            expect(totalNumberOfInstances).toBeLessThan(100 * Animal.instances.length);
        });

        it("should accept a function to filter the instances that can be selected in the result", function () {
            var Animal = function (legs) {
                this.legs = legs;
            };
            Animal = createBusinessObjectType(Animal);

            for (var i = 0; i < 5; i++) {
                new Animal(4); // 5 dogs
            }
            for (var i = 0; i < 2; i++) {
                new Animal(2); // 2 birds
            }
            for (var i = 0; i < 1; i++) {
                new Animal(1000); // 1 centipede
            }

            var allAnimals = Animal.pick(8, function (animal) {
                return true;
            });

            var allDogs = Animal.pick(8, function( animal) {
                return (animal.legs === 4);
            });

            var allDogsAndBirds = Animal.pick(8, function( animal) {
                return (animal.legs < 1000);
            });

            expect(allAnimals.length).toBe(8);
            expect(allDogs.length).toBe(5);
            expect(allDogsAndBirds.length).toBe(7);
        });


    });


});