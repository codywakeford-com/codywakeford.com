import { test, expect } from "@playwright/test"

test("Example Test", async ({ page }) => {
    await page.goto("/")
    expect(true).toBe(true)
})
