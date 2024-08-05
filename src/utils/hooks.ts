import { ICustomWorld } from "./custom-world";
require("dotenv").config();

import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  Status,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import {
  chromium,
  ChromiumBrowser,
  ConsoleMessage,
  request,
  Browser,
} from "@playwright/test";
import { ITestCaseHookParameter } from "@cucumber/cucumber/lib/support_code_library_builder/types";

let browser: ChromiumBrowser | Browser;
const tracesDir = "traces";

setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
  switch (process.env.BROWSER) {
    case "chrome":
      browser = await chromium.launch({
        headless: process.env.CI ? true : false,
        channel: "chrome",
      });
      break;
    default:
      browser = await chromium.launch();
  }
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, "-");
  this.context = await browser.newContext({
    acceptDownloads: true,
    recordVideo: { dir: "test-results/videos" },
    viewport: { width: 1920, height: 1080 },
  });

  this.apiRequest = await request.newContext({});

  await this.context.tracing.start({ screenshots: true, snapshots: true });
  this.page = await this.context.newPage();

  this.page.on("console", async (msg: ConsoleMessage) => {
    if (msg.type() === "log") {
      this.attach(msg.text());
    }
  });
  this.feature = pickle;
});

//add this to ignore the tests
Before({ tags: "@ignore" }, async function () {
  return "skipped" as any;
}); //

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  if (result) {
    this.attach(
      `Status: ${result?.status}. Duration:${result.duration?.seconds}s`,
    );

    if (result.status !== Status.PASSED) {
      const image = await this.page?.screenshot();

      const timePart = this.startTime
        ?.toISOString()
        .split(".")[0]
        .replaceAll(":", "_");

      image && (await this.attach(image, "image/png"));
      await this.context?.tracing.stop({
        path: `${tracesDir}/${this.testName}-${timePart}trace.zip`,
      });

      const video = await this.page?.video()?.path();
      video &&
        this.log(
          `<a href="file://${video}" target="_blank">Open Video File</a>`,
        );

      const traceFilePath = `${tracesDir}/${this.testName}-${timePart}trace.zip`;
      const traceFileLink = `<a href="https://trace.playwright.dev/?trace=blob:https://trace.playwright.dev/${traceFilePath}" target="_blank">Open Trace File</a>`;
      this.log(traceFileLink);
    }
  }
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser.close();
});
