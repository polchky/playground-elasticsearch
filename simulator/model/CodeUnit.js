var createBusinessObjectType = require('./businessObject').createBusinessObjectType;

var Chance = require('chance');
var chance = new Chance();

function CodeUnit( feature, component, developer ) {
    this.correctness = Math.floor(Math.random() * 100); // 0..100
    this.feature = feature;
    this.contributors = [];
    if (developer) {
        this.contributors.push(developer);
    }
    this.unitTests = [];
    this.component = component || chance.pick(feature.impactedComponents, 1);
    this.component.addCodeUnit(this);
}

var CodeUnit = createBusinessObjectType(CodeUnit);

CodeUnit.prototype.addContributor = function( developer ) {
    this.contributors.push( developer );
};

exports.CodeUnit = CodeUnit;