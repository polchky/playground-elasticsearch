"use strict";

var Yadda = require('yadda');
var English = Yadda.localisation.English;
var Dictionary = Yadda.Dictionary;
var assert = require('assert');

module.exports = (function() {

		var dictionary = new Dictionary()
    var library = English.library(dictionary)

		.given("I am the Probe Dock home page", function (callback) {
		  // Write code here that turns the phrase above into concrete actions
		  callback();
		})

		.when("I type (.*) in the (.*) field and my password in the password field", function (callback) {
		  // Write code here that turns the phrase above into concrete actions
			//console.log(text + " in " + field);
		  callback();
		})

		.then("I arrive on my page", function (callback) {
		  // Write code here that turns the phrase above into concrete actions
		  callback();
		});

    return library;
})();