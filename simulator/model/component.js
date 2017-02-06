var createBusinessObjectType = require('./businessObject').createBusinessObjectType;

var Chance = require('chance');
var chance = new Chance();

function Component(name) {
    this.name = name;
    this.codeUnits = [];
}

var Component = createBusinessObjectType(Component);

Component.prototype.addCodeUnit = function( codeUnit ) {
    this.codeUnits.push(codeUnit);
};

Component.prototype.simplify = function() {
    return {
        id: this.id,
        name: this.name
    }
}

exports.Component = Component;
