import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import * as messages from "@cucumber/messages";
import "allure-cucumberjs";


import {
  BrowserContext,
  Page,
  PlaywrightTestOptions,
  APIRequestContext,
} from "@playwright/test";

export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: string };
}

export interface ICustomWorld extends World {
  feature?: messages.Pickle;
  context?: BrowserContext;
  page?: Page;
  testName?: string;
  startTime?: Date;
  apiRequest?: APIRequestContext;
  playwrightOptions?: PlaywrightTestOptions;
}

export class CustomWorld extends World implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
