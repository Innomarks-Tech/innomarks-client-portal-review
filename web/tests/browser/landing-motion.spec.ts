import { test, expect } from "@playwright/test";
test("landing text remains readable with reduced motion and without JavaScript", async ({ browser }) => {
  for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({ javaScriptEnabled, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Technology that moves your business");
    const serviceButtons = page.locator('#services nav[aria-label="Choose a service"] button');
    await expect(serviceButtons.first()).toBeVisible();
    if (javaScriptEnabled) {
      await serviceButtons.nth(2).click();
      await expect(page.getByRole("link", { name: "Discuss software", exact: true })).toBeVisible();
    } else {
      await expect(page.getByRole("link", { name: "Discuss strategy", exact: true })).toBeVisible();
    }
    expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length)).toBe(0);
    await context.close();
  }
});
