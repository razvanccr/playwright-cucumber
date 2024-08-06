import { ICustomWorld } from "../../utils/custom-world";
import { Given, When, Then } from "@cucumber/cucumber";
import { HomePage } from "../../pages/HomePage";

let homePage;

Given("the user is on the homepage page", async function (this: ICustomWorld) {
  homePage = new HomePage(this.page!);
  await homePage.navigateTo();
});

When(
  "the user enters {string} and password {string}",
  async function (this: ICustomWorld, username: string, password: string) {
    await homePage!.login(username, password);
  },
);

When("clicks the login button", async function (this: ICustomWorld) {
  await homePage!.clickLogin();
});

Then(
  "the user is informed with the message {string}",
  async function (this: ICustomWorld, errorMessage: string) {
    await homePage!.getFormErrorMessage(errorMessage);
  
  },
);

