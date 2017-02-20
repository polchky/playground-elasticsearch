var createBusinessObjectType = require('./businessObject').createBusinessObjectType;
var moment = require('moment');

function UnitTest(codeUnit, feature, developer, time) {
    this.date = moment(time);
    this.codeUnit = codeUnit;
    codeUnit.unitTests.push(this);
    this.developer = developer;
    this.feature = feature;
    feature.unitTests.push(this);
};



var UnitTest = createBusinessObjectType(UnitTest);

UnitTest.prototype.simplify = function() {
    return {
        date: this.date,
        id: this.id,
        codeUnitId: this.codeUnit.id,
        developerId: this.developer.id,
        featureId: this.feature.id
    }
}

exports.UnitTest = UnitTest;
