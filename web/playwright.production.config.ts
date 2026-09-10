import { defineConfig } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT || "3000";
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests/browser",
  testIgnore: ["**/staff-email.spec.ts", "**/staff-review.spec.ts"],
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: { baseURL, channel: process.env.PLAYWRIGHT_CHANNEL || "msedge", trace: "retain-on-failure" },
  webServer: {
    command: `npm run start -- -p ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
