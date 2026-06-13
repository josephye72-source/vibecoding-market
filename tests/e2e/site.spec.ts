import { expect, test } from "@playwright/test";

test("homepage renders the title and five project cards", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Vibe Coding Market/i })).toBeVisible();
  await expect(page.getByTestId("project-card")).toHaveCount(5);
});
