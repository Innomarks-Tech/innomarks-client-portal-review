import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("desktop services, keyboard disclosure, links and accessibility", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Technology that moves your business");
  const items = page.locator('#services nav[aria-label="Choose a service"] button');
  await expect(items).toHaveCount(6);
  for (const item of await items.all()) {
    await item.focus();
    await page.keyboard.press('Enter');
    await expect(item).toHaveAttribute('aria-current', 'step');
    const activePanel = page.locator('#services article:not([hidden])');
    await expect(activePanel).toHaveCount(1);
    await expect(activePanel.getByRole('link')).toHaveAttribute('href', /project-discovery\?service=/);
    await expect(item).toBeFocused();
  }
  await items.first().click();
  await page.screenshot({ path: "test-results/home-desktop.png", fullPage: true });
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("desktop scrolling advances and reverses the sticky service journey", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const items = page.locator('#services nav[aria-label="Choose a service"] button');
  await expect(items).toHaveCount(6);
  await expect.poll(() => page.locator("#services").evaluate((element) => element.clientHeight > window.innerHeight * 3)).toBe(true);

  const scrollToService = async (index: number) => {
    await page.locator("#services").evaluate((element, target) => {
      const guide = element.querySelector('nav[aria-label="Choose a service"]')?.parentElement;
      if (!guide) throw new Error("Service guide not found");
      const top = window.scrollY + element.getBoundingClientRect().top;
      const travel = Math.max(1, (element as HTMLElement).offsetHeight - guide.offsetHeight);
      window.scrollTo(0, top + (travel * Number(target)) / 5);
    }, index);
    await expect(items.nth(index)).toHaveAttribute("aria-current", "step");
  };

  await scrollToService(4);
  await scrollToService(2);
  await scrollToService(0);
});

test("client feedback keeps moving after pointer interaction", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const viewport = page.locator('[aria-label="Sample client feedback"]');
  const track = viewport.locator(":scope > div");
  await viewport.click({ position: { x: 20, y: 20 } });
  await expect.poll(() => track.evaluate((element) => getComputedStyle(element).animationPlayState)).toBe("running");
});

test("mobile navigation, no overflow, FAQ, discovery review and disabled sending", async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden();
  await page.locator("#faqs summary").first().click();
  await expect(page.locator("#faqs details").first()).toHaveAttribute("open", "");
  await page.screenshot({ path: "test-results/home-mobile.png", fullPage: true });
  await page.goto("/project-discovery?service=data");
  await expect(page.getByLabel("Data analytics & business intelligence", { exact: true })).toBeChecked();
  await page.getByLabel("Tell us about your project").fill("We need clearer reporting for our operations team.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Your name", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Email address", { exact: true }).fill("visitor@example.test");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Does everything look right?" })).toBeFocused();
  await page.getByRole("button", { name: "Edit project", exact: true }).click();
  await expect(page.getByLabel("Tell us about your project")).toHaveValue("We need clearer reporting for our operations team.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("Test Visitor");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.locator(".form-panel").getByRole("alert")).toContainText("has not been sent");
  await expect(page.locator(".form-panel").getByRole("alert")).toBeFocused();
  await page.screenshot({ path: "test-results/discovery-mobile.png", fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  const response = await page.request.post("/api/inquiries", { data: {} });
  expect(response.status()).toBe(503);
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("privacy notice");
});
