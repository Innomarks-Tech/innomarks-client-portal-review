import { test, expect } from "@playwright/test";

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`landing fits at ${width}px with every service expanded`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const items = page.locator('#services nav[aria-label="Choose a service"] button');
    for (const item of await items.all()) {
      await item.click();
      const activePanel = page.locator("#services article:not([hidden])");
      await expect(activePanel.getByRole("link")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const first = await activePanel.getByRole("heading", { level: 3 }).boundingBox();
      const second = await activePanel.getByText("What this could look like", { exact: true }).boundingBox();
      expect(first && second && (first.x + first.width <= second.x + 1 || first.y + first.height <= second.y + 1)).toBeTruthy();
    }
    await page.screenshot({ path: `test-results/landing-${width}.png`, fullPage: true });
    await page.goto("/project-discovery?service=software");
    await expect(page.getByLabel("Software development", { exact: true })).toBeChecked();
  });
}
