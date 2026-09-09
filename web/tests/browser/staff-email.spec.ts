import { test, expect } from "@playwright/test";
test("email preview personalisation, approvals and automation deduplication", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/admin/preview/email-templates");
  await page.getByLabel("Template", { exact: true }).selectOption("clarify");
  await expect(page.locator(".email-render")).toContainText("Hi Thabo");
  await page.getByRole("button", { name: "Create approval draft" }).click();
  await expect(page.locator(".email-queue")).toContainText("Awaiting approval");
  await page.getByRole("button", { name: "Approve & simulate send" }).click();
  await expect(page.locator(".email-queue")).toContainText("Simulated sent");
  await page.getByRole("link", { name: "Automation", exact: true }).click();
  const rule = page.locator(".automation-rules > section").first();
  await rule.getByLabel("Enable this preview rule").check();
  await rule.getByRole("button", { name: "Test event" }).click();
  await expect(page.getByRole("status").filter({ hasText: "No email was delivered" })).toBeVisible();
  await rule.getByRole("button", { name: "Test event" }).click();
  await expect(page.getByRole("status").filter({ hasText: "already been processed" })).toBeVisible();
  await expect(page.locator(".email-queue article")).toHaveCount(2);
  await page.reload();
  await expect(page.locator(".email-queue")).toContainText("No email drafts yet");
});
test("email workspaces fit mobile and tablet", async ({ page }) => {
  test.setTimeout(60_000);
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["email-templates", "automations"]) {
      await page.goto("/admin/preview/" + path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: `test-results/email-${path}-${width}.png`, fullPage: true });
    }
  }
});
