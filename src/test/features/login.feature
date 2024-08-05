# @ignore
@debug
Feature: User Authentication tests

  Background:
    Given the user is on the homepage page

  Scenario: Failed login using invalid data for the login form
    When the user enters "username" and password "password"
    And clicks the login button
    Then the user is informed with the message "Epic sadface: Username and password do not match any user in this service"

  Scenario: Failed login using invalid data for the login formx
    When the user enters "username" and password "password"
    And clicks the login button
    Then the user is informed with the message "Epic sadface: Username and password do not match any user in this servicex"
