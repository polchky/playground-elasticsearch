var createBusinessObjectType = require('./businessObject').createBusinessObjectType;

function UnitTest(codeUnit, feature, developer) {
    this.codeUnit = codeUnit;
    codeUnit.unitTests.push(this);
    this.developer = developer;
    this.feature = feature;
    feature.unitTests.push(this);
};



var UnitTest = createBusinessObjectType(UnitTest);

UnitTest.prototype.simplify = function() {
    return {
        id: this.id,
        codeUnitId: this.codeUnit.id,
        developerId: this.developer.id,
        featureId: this.feature.id
    }
}

exports.UnitTest = UnitTest;
