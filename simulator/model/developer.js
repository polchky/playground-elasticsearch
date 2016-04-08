var createBusinessObjectType = require('./businessObject').createBusinessObjectType;
var Chance = require('chance');

var chance = new Chance();

function Developer(firstName, lastName) {
    this.firstName = firstName || chance.first();
    this.lastName = lastName || chance.last();

    this.abilityToWriteUnitTests = Math.floor(Math.random() * 101);
    this.abilityToWriteCorrectCode = Math.floor(Math.random() * 101);
}

var Developer = createBusinessObjectType(Developer);

exports.Developer = Developer;