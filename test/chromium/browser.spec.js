// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

module.exports.describe = function({testRunner, expect, headless, playwright, FFOX, CHROME, WEBKIT}) {
  const {describe, xdescribe, fdescribe} = testRunner;
  const {it, fit, xit} = testRunner;
  const {beforeAll, beforeEach, afterAll, afterEach} = testRunner;

  describe('CrBrowser', function() {
    it('should not return child_process for remote browser', async function({browser}) {
      const browserWSEndpoint = browser.chromium.wsEndpoint();
      const remoteBrowser = await playwright.connect({browserWSEndpoint});
      expect(remoteBrowser.process()).toBe(null);
      remoteBrowser.disconnect();
    });
    it('should close all belonging targets once closing context', async function({browser, newContext}) {
      const targets = async () => (await browser.chromium.targets()).filter(t => t.type() === 'page');
      expect((await targets()).length).toBe(1);

      const context = await newContext();
      await context.newPage();
      expect((await targets()).length).toBe(2);
      expect((await context.pages()).length).toBe(1);

      await context.close();
      expect((await targets()).length).toBe(1);
    });
  });
};