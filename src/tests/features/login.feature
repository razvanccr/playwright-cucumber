# @ignore
@debug
Feature: User Authentication tests

  Background:
    Given the user is on the homepage page

  @debug @current @sadface
  Scenario: Success login to homepage
    When the user logins with the following credentials:
      | username      | password     |
      | standard_user | secret_sauce |
    And clicks the login button
    Then the user should be logged in 'inventory.html'
    And the url should contain "inventory.html"

  Scenario: Failed login using invalid data for the login form
    When the user enters "username" and password "password"
    And clicks the login button
    Then the user is informed with the message "Epic sadface: Username and password do not match any user in this service"

  Scenario Outline: Failed login to check missing username and password validations
    When the user enters the username "<username>" and the password "<password>"
    And clicks the login button
    Then the user receives the error message "<message>"

    @dataset
    Examples:
      | username | password | message                            |
      |          | bdd      | Epic sadface: Username is required |
      | asdx     |          | Epic sadface: Password is required |
