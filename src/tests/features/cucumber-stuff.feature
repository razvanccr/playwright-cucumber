Feature: Testing various cucumber functionalities
@faster
 Scenario: User provides a valid email address
 Given the user email is user@example.com
 Then the email should be saved correctly

 Scenario: The steps are defined using the regex instead of string
 Given the user has a format first + last name "john.snow" format
 Then the user is a complex name formed by 2 words

@current
 Scenario: The steps are defined using the regex instead of string
 Given the user has a format first + last name "john.snow" format
 Then the user is a complex name formed by 2 words