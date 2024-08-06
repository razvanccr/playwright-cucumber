import { Locator, Page, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly formErrorMessage: Locator;
  readonly buttonMenuBurger: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("#user-name");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#login-button");
    this.formErrorMessage = page.locator("h3[data-test='error']");
    this.buttonMenuBurger = page.locator("div[bm-burger-button]");
  }

  async navigateTo(): Promise<void> {
    await this.page.goto(process.env.URL!);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click({ delay: 1000 });
  }

  async getFormErrorMessage(errorMessage: string) {
    await expect(this.formErrorMessage).toHaveText(errorMessage);
  }

  async assertPageURLContainsString(urlSuffix: string) {
    await expect(this.page.url()).toContain(urlSuffix);
  }

  async waitForLoginToBeSuccessfull(urlSuffix: string) {
    await this.page.waitForURL(process.env.URL + urlSuffix);
  }
}
