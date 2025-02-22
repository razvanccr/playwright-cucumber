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
import fs from "fs";

let browser: ChromiumBrowser | Browser;

const tracesDir = "test-results/traces";
const videoDir = "test-results/videos";

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
    recordVideo: { dir: videoDir },
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

After(async function ({ result, pickle }: ITestCaseHookParameter) {
  if (result) {
    this.attach(
      `Status: ${result?.status}. Duration:${result.duration?.seconds}s`,
    );

    if (result.status !== Status.PASSED) {
      const image = await this.page?.screenshot({
        path: `./test-results/screenshots/${pickle.name.trim()}.png`,
        type: "png",
      });

      const timePart = this.startTime
        ?.toISOString()
        .split(".")[0]
        .replaceAll(":", "_");

        
      image && (await this.attach(image, "image/png"));

      const tracePath = `${tracesDir}/${this.testName}-${timePart}trace.zip`;
      
      await this.context?.tracing.stop({
        path: tracePath,
      });

      const video = await this.page?.video()?.path();
      video &&
        this.log(`<video controls width="600">
          <source
              src="
             file://${video}"
              type="video/webm">
      </video>`);


      const traceFileLink = `<a href="https://trace.playwright.dev/?trace=file://${tracePath}" target="_blank">Open</a>`;
      this.link(traceFileLink);
      this.log(`Trace file: ${traceFileLink}`);

      await this.attach(`Trace file: ${traceFileLink}`, "text/html");
    }
  }
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser.close();
});
