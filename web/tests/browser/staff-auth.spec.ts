import { test, expect } from "@playwright/test";

test("signed-out staff routes require login and expose account recovery", async ({ page }) => {
  test.setTimeout(60_000);
  for (const route of ["/admin/leads", "/admin/leads/00000000-0000-4000-8000-000000000000"]) {
    await page.goto(route);
    await expect(page).toHaveURL(/admin\/login/);
    await expect(page.getByRole("heading", { name: "Staff Portal", exact: true })).toBeVisible();
  }
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByLabel("Email", { exact: true })).toBeFocused();
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
  await expect(page.getByLabel("Staff email", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send secure link" })).toBeEnabled();
});
