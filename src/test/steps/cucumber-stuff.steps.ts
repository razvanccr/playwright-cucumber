import { Given, Then } from "@cucumber/cucumber";
import { defineParameterType } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

defineParameterType({
  name: "email",
  regexp: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/, //email
  transformer: (s) => s,
});

Given("the user email is {email}", function (email) {
  this.userEmail = email;
});

Then("the email should be saved correctly", function () {
  if (!this.userEmail) {
    throw new Error("Email was not saved correctly");
  }
});

Then(
  /the user is a complex name formed by (\d+) words/,
  function (nameCount: number) {
    expect(this.arrayOfStrings).toHaveLength(nameCount);
  },
);

Given(
  /the user has a format first \+ last name "([^"]+)" format/,
  function (s: string) {
    this.arrayOfStrings = s.split(".");
  },
);
