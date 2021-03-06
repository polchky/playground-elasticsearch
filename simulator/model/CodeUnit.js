var createBusinessObjectType = require('./businessObject').createBusinessObjectType;

var Chance = require('chance');
var chance = new Chance();
var moment = require('moment');

function CodeUnit( feature, component, developer, time) {
    this.date = moment(time);
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

CodeUnit.prototype.simplify = function() {
    var res = {
        date: this.date,
        id: this.id,
        featureId: this.feature.id,
        componentId: this.component.id
    }
    return res;
}

exports.CodeUnit = CodeUnit;
