import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { HomePage } from "../../pages/HomePage";

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

Then(
  "the user should be logged in {string}",
  async function (urlSuffix: string) {
    await this.homePage.waitForLoginToBeSuccessfull(urlSuffix);
  },
);

When(
  "the user logins with the following credentials:",
  async function (dataTable: DataTable) {
    const data = dataTable.hashes();

    data.forEach(async (row) => {
      const username = row.username;
      const password = row.password;

      await this.homePage.login(username, password);
    });
  },
);

Then("the url should contain {string}", async function (s: string) {
  this.homePage.assertPageURLContainsString(s);
});
