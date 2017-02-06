var pad = require('pad');
var util = require('util');
var Chance = require('chance');

var chance = new Chance();


function createBusinessObjectType(Type) {

    console.log("Augmenting " + Type.name);
    console.log(Type.prototype);

    var BOType = function () {
        Type.apply(this, arguments);
        BOType.instances.push(this);
        this.id = Type.name + "_" + pad(5, BOType.instances.length, '0');
    };

    BOType.instances = [];

    BOType.pick = function (number, filter) {
        if (number === 0) {
            return [];
        }
        var candidates = BOType.instances;
        if (filter) {
            candidates = candidates.filter( filter );
        }
        if (candidates.length === 0) {
            return [];
        };
        number = number || Math.floor(Math.random() * candidates.length + 1);
        if (number === 1) {
            var result = [];
            result.push(chance.pick(candidates));
            return result;
        } else {
            return chance.pick(candidates, number);
        }
    };

    BOType.prototype.dump = function() {
        console.log(Type.name + " : " + this.id);
    };

    return BOType;
};

exports.createBusinessObjectType = createBusinessObjectType;
