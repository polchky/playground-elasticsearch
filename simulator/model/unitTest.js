var createBusinessObjectType = require('./businessObject').createBusinessObjectType;

function UnitTest(codeUnit, feature, developer) {
    this.codeUnit = codeUnit;
    codeUnit.unitTests.push(this);
    this.developer = developer;
    this.feature = feature;
    feature.unitTests.push(this);
};

var UnitTest = createBusinessObjectType(UnitTest);

exports.UnitTest = UnitTest;