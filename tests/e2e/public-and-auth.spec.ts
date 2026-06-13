import { existsSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

type Credentials = {
  email: string;
  password: string;
};

function parseLocalEnv(path: string) {
  if (!existsSync(path)) {
    return {};
  }

  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        return [line.slice(0, separatorIndex), line.slice(separatorIndex + 1)];
      })
  );
}

const adminEnv = parseLocalEnv(".supabase-admin.local");
const clientEnv = parseLocalEnv(".supabase-client-test.local");

const adminCredentials: Credentials | null =
  adminEnv.ADMIN_EMAIL && adminEnv.ADMIN_PASSWORD
    ? { email: adminEnv.ADMIN_EMAIL, password: adminEnv.ADMIN_PASSWORD }
    : null;

const clientCredentials: Credentials | null =
  clientEnv.CLIENT_EMAIL && clientEnv.CLIENT_PASSWORD
    ? { email: clientEnv.CLIENT_EMAIL, password: clientEnv.CLIENT_PASSWORD }
    : null;

async function loginAndGetPath(page: import("@playwright/test").Page, credentials: Credentials, next?: string) {
  const loginPath = next ? `/login?next=${encodeURIComponent(next)}` : "/login";

  await page.goto(loginPath);
  await page.getByLabel(/email/i).fill(credentials.email);
  await page.getByLabel(/mot de passe/i).fill(credentials.password);
  await page.getByRole("button", { name: /acc.der . mon espace|acceder a mon espace/i }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 15_000 }).catch(() => {});
  await page.waitForLoadState("networkidle").catch(() => {});

  const url = new URL(page.url());
  return `${url.pathname}${url.search}`;
}

test("public home loads Atelier Nox promise", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /nous pilotons votre croissance locale/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /diagnostic/i }).first()).toBeVisible();
});

test("login page loads Supabase account form without temporary access gate", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /espace client/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
  await expect(page.getByText(/acc.s mvp temporaire|acc.s temporaire/i)).toHaveCount(0);
});

test("diagnostic gratuit page loads lead capture form", async ({ page }) => {
  await page.goto("/diagnostic-gratuit");
  await expect(page.getByRole("heading", { name: /parlons de votre commerce/i })).toBeVisible();
  await expect(page.getByLabel(/nom de votre activit/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /demander le diagnostic/i })).toBeVisible();
});

test("protected admin route redirects anonymous visitors to login", async ({ page }) => {
  await page.goto("/clients");
  await expect(page).toHaveURL(/\/login\?next=%2Fclients/);
});

test.describe("role-aware login redirects", () => {
  test.describe.configure({ mode: "serial" });
  test.skip(!adminCredentials || !clientCredentials, "Local Supabase test credentials are not configured.");

  test("admin and client receive role defaults when next is absent", async ({ browser }) => {
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await expect(await loginAndGetPath(adminPage, adminCredentials!)).toBe("/demandes");
    await adminContext.close();

    const clientContext = await browser.newContext();
    const clientPage = await clientContext.newPage();
    await expect(await loginAndGetPath(clientPage, clientCredentials!)).toBe("/portal");
    await clientContext.close();
  });

  test("admin can use allowed admin next paths", async ({ browser }) => {
    const demandesContext = await browser.newContext();
    const demandesPage = await demandesContext.newPage();
    await expect(await loginAndGetPath(demandesPage, adminCredentials!, "/demandes")).toBe("/demandes");
    await demandesContext.close();

    const clientsContext = await browser.newContext();
    const clientsPage = await clientsContext.newPage();
    await expect(await loginAndGetPath(clientsPage, adminCredentials!, "/clients")).toBe("/clients");
    await clientsContext.close();
  });

  test("client cannot use admin next paths", async ({ browser }) => {
    const demandesContext = await browser.newContext();
    const demandesPage = await demandesContext.newPage();
    await expect(await loginAndGetPath(demandesPage, clientCredentials!, "/demandes")).toBe("/portal");
    await demandesContext.close();

    const clientsContext = await browser.newContext();
    const clientsPage = await clientsContext.newPage();
    await expect(await loginAndGetPath(clientsPage, clientCredentials!, "/clients")).toBe("/portal");
    await clientsContext.close();
  });

  test("external or protocol-relative next paths fall back to the role default", async ({ browser }) => {
    const externalContext = await browser.newContext();
    const externalPage = await externalContext.newPage();
    await expect(await loginAndGetPath(externalPage, clientCredentials!, "https://example.com")).toBe("/portal");
    await externalContext.close();

    const protocolRelativeContext = await browser.newContext();
    const protocolRelativePage = await protocolRelativeContext.newPage();
    await expect(await loginAndGetPath(protocolRelativePage, clientCredentials!, "//example.com")).toBe("/portal");
    await protocolRelativeContext.close();
  });
});
