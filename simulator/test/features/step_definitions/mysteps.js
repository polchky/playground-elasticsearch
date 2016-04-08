module.exports = function () {

this.Given(/^I am the Probe Dock home page$/, function (callback) {
  // Write code here that turns the phrase above into concrete actions
  callback();
});

this.When(/^I type (.*) in the (.*) field and my password in the password field$/, function (text, field, callback) {
  // Write code here that turns the phrase above into concrete actions
	console.log(text + " in " + field);
  callback();
});

this.Then(/^I arrive on my page$/, function (callback) {
  // Write code here that turns the phrase above into concrete actions
  callback();
});

};
