import { ICustomWorld } from "../../utils/custom-world";
import { Given, When, Then } from "@cucumber/cucumber";
import { HomePage } from "../../pages/HomePage";

//let homePage;

Given("the user is on the homepage page", async function () {
  this.homePage = new HomePage(this.page!);
  await this.homePage.navigateTo();
});

When(
  "the user enters {string} and password {string}",
  async function (username: string, password: string) {
    await this.homePage.login(username, password);
  },
);

When("clicks the login button", async function () {
  await this.homePage.clickLogin();
});

Then(
  "the user is informed with the message {string}",
  async function (errorMessage: string) {
    await this.homePage.getFormErrorMessage(errorMessage);
  },
);

When(
  "the user enters the username {string} and the password {string}",
  async function (username: string, password: string) {
    await this.homePage.login(username, password);
  },
);

Then(
  "the user receives the error message {string}",
  async function (error: string) {
    await this.homePage.getFormErrorMessage(error);
  },
);
