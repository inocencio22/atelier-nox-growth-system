import { expect, test } from "@playwright/test";

test("public home loads Atelier Nox promise", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /plus de clarte/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /diagnostic/i }).first()).toBeVisible();
});

test("login page loads account and temporary access forms", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /connexion/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/code d'accès/i)).toBeVisible();
});

test("diagnostic gratuit page loads lead capture form", async ({ page }) => {
  await page.goto("/diagnostic-gratuit");
  await expect(page.getByRole("heading", { name: /vos signaux digitaux/i })).toBeVisible();
  await expect(page.getByLabel(/nom du business/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /demander le diagnostic/i })).toBeVisible();
});

test("protected admin route redirects anonymous visitors to login", async ({ page }) => {
  await page.goto("/clients");
  await expect(page).toHaveURL(/\/login\?next=%2Fclients/);
});
