import fs from 'fs';
import path from 'path';
import { test, expect, type Page } from '@playwright/test';

type VisualRoute = {
  path: string;
  locale: string;
  kind: string;
  label: string;
  screenshotKey: string;
  expectedState: 'static' | 'items' | 'empty' | 'detail';
  readySelectors?: string[];
  errorSelectors?: string[];
};

type VisualManifest = {
  generatedAt: string;
  source: {
    apiUrl: string;
    locales: string[];
    staticOnly: boolean;
  };
  summary: {
    totalRoutes: number;
  };
  routes: VisualRoute[];
};

const baseUrl = process.env.E2E_BASE_URL || 'https://dangkhoaow.github.io/av-foundation-frontend-web/';
const base = new URL(baseUrl);
const basePath = base.pathname.replace(/\/$/, '');
const manifestPath = resolveManifestPath();

const buildUrl = (routePath: string) => {
  const normalizedRoute = routePath.startsWith('/') ? routePath : `/${routePath}`;
  const pathWithBase = `${basePath}${normalizedRoute}`;
  const finalPath = pathWithBase || '/';
  return `${base.origin}${finalPath}`;
};

function resolveManifestPath() {
  if (process.env.VISUAL_MANIFEST_PATH) {
    return path.resolve(process.cwd(), process.env.VISUAL_MANIFEST_PATH);
  }

  const manifestDir = path.resolve(process.cwd(), '.agent', 'skills', 'test-runner', 'visual', 'manifests');
  if (!fs.existsSync(manifestDir)) {
    return manifestDir;
  }

  const files = fs
    .readdirSync(manifestDir)
    .filter((file) => file.startsWith('visual-manifest-') && file.endsWith('.json'))
    .sort();

  return files.length ? path.join(manifestDir, files[files.length - 1]) : manifestDir;
}

function loadManifest() {
  if (!fs.existsSync(manifestPath) || fs.statSync(manifestPath).isDirectory()) {
    throw new Error(`Visual manifest not found at ${manifestPath}. Run the visual manifest generator first.`);
  }

  const raw = fs.readFileSync(manifestPath, 'utf8');
  return JSON.parse(raw) as VisualManifest;
}

const manifestLoadResult = (() => {
  try {
    return { manifest: loadManifest(), error: null as Error | null };
  } catch (error) {
    return { manifest: null as VisualManifest | null, error: error as Error };
  }
})();

const maxDiffPixelRatio = Number.parseFloat(process.env.VISUAL_MAX_DIFF_PIXEL_RATIO || '0.02');

const waitForRouteReady = async (page: Page, route: VisualRoute) => {
  try {
    await page.waitForLoadState('networkidle', { timeout: 10_000 });
  } catch (error) {
    console.warn('[Visual] networkidle wait timed out', { path: route.path, error: error instanceof Error ? error.message : String(error) });
  }

  const errorSelectors = route.errorSelectors || [];
  for (const selector of errorSelectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      throw new Error(`Route ${route.path} rendered an error state: ${selector}`);
    }
  }

  const readySelectors = route.readySelectors || [];
  if (!readySelectors.length) return;

  await Promise.any(
    readySelectors.map((selector) =>
      page.locator(selector).first().waitFor({ state: 'visible', timeout: 30_000 })
    )
  ).catch((error) => {
    throw new Error(
      `Route ${route.path} did not reach a ready state (${readySelectors.join(', ')}): ${error instanceof Error ? error.message : String(error)}`
    );
  });
};

test.describe.configure({ mode: 'parallel' });

if (manifestLoadResult.error) {
  test('visual manifest loads @visual', async () => {
    throw manifestLoadResult.error;
  });
} else {
  const manifest = manifestLoadResult.manifest!;
  console.info('[Visual] Loaded manifest', {
    manifestPath,
    routeCount: manifest.routes.length,
    generatedAt: manifest.generatedAt,
    apiUrl: manifest.source.apiUrl,
  });

  if (!manifest.routes.length) {
    test('visual manifest contains routes @visual', async () => {
      throw new Error(`Visual manifest at ${manifestPath} did not contain any routes.`);
    });
  } else {
    for (const route of manifest.routes) {
      test(`${route.kind} @visual ${route.locale} ${route.path}`, async ({ page }) => {
        const response = await page.goto(buildUrl(route.path), { waitUntil: 'domcontentloaded' });
        expect(response, `Failed to load ${route.path}`).not.toBeNull();
        expect(response?.ok(), `Unexpected status for ${route.path}`).toBeTruthy();

        await waitForRouteReady(page, route);

        await expect(page).toHaveScreenshot(`${route.screenshotKey}.png`, {
          animations: 'disabled',
          caret: 'hide',
          scale: 'css',
          maxDiffPixelRatio: Number.isFinite(maxDiffPixelRatio) ? maxDiffPixelRatio : 0.02,
        });
      });
    }
  }
}
