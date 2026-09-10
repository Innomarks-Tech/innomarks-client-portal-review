import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [390, 768, 1440]) {
  test(`staff portal layout and accessibility at ${width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["login", "preview", "preview/north-star-logistics"]) {
      await page.goto("/admin/" + route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: `test-results/staff-fixed-${width}-${route.replaceAll("/", "-")}.png`, fullPage: true });
      expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}

test("staff preview search, filters, status, notes and refresh isolation", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/admin/preview");
  await page.getByRole("link", { name: "Contacted 1", exact: true }).click();
  await expect(page).toHaveURL(/status=Contacted/);
  await expect(page.locator('input[name="status"]')).toHaveValue("Contacted");
  await page.getByRole("textbox", { name: "Search preview inquiries" }).fill("Khula");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/status=Contacted/);
  await expect(page.locator("main")).toContainText("Khula Learning Hub");
  await expect(page.locator("main")).not.toContainText("Northern Star Logistics");
  await page.getByRole("textbox", { name: "Search preview inquiries" }).fill("no-such-company");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No inquiries match your search." })).toBeVisible();
  await page.getByRole("link", { name: "Clear search and filters" }).click();
  await page.goto("/admin/preview/north-star-logistics");
  const writes: string[] = [];
  page.on("request", (request) => { if (request.method() !== "GET") writes.push(request.url()); });
  await page.getByRole("combobox", { name: "Status", exact: true }).selectOption("Contacted");
  await page.getByRole("button", { name: "Save status" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Preview status set to Contacted." })).toBeVisible();
  await page.getByRole("textbox", { name: "Private note" }).fill("Preview verification note");
  await page.getByRole("button", { name: "Add note" }).click();
  await expect(page.getByRole("region", { name: "What the team has done" })).toContainText("Preview verification note");
  await expect(page.getByRole("textbox", { name: "Private note" })).toBeEmpty();
  expect(writes).toEqual([]);
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Status", exact: true })).toHaveValue("New");
  await expect(page.locator("main")).not.toContainText("Preview verification note");
});
