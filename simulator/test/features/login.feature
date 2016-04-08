Feature: login
	As a user of Probe Dock
	I want to use credentials to log into the site
	So that I have access to private information and features
	
	Scenario: successful login
		Given I am the Probe Dock home page
		When I type my user id in the userid field and my password in the password field
		Then I arrive on my page