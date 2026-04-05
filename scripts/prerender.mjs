import fs from 'fs/promises';
import path from 'path';
import http from 'http';
import sirv from 'sirv';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

const basePath = '/av-foundation-frontend-web';
const siteUrl = (process.env.VITE_SITE_URL || 'https://dangkhoaow.github.io/av-foundation-frontend-web').replace(/\/$/, '');
const apiUrl = (process.env.VITE_API_URL || process.env.API_URL || 'http://localhost:3001').replace(/\/$/, '');
const maxArtworks = Number(process.env.PRERENDER_MAX_ARTWORKS || '500');
const port = Number(process.env.PRERENDER_PORT || '4173');

const locales = ['vi', 'en'];
const staticPaths = ['', '/collection', '/artists', '/events', '/news', '/knowledge', '/who-we-are'];

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status})`);
  }
  return response.json();
};

const fetchAllPages = async (endpoint, limit, cap) => {
  const results = [];
  let page = 1;

  while (true) {
    const url = new URL(`${apiUrl}${endpoint}`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(limit));

    const payload = await fetchJson(url.toString());
    const items = payload?.data?.data || [];
    const total = payload?.data?.meta?.total || 0;

    results.push(...items);

    console.info('[Prerender] Fetched page', {
      endpoint,
      page,
      count: items.length,
      total,
    });

    if (items.length === 0) break;
    if (cap && results.length >= cap) break;
    if (!total || page * limit >= total) break;
    page += 1;
  }

  return cap ? results.slice(0, cap) : results;
};

const buildRoutes = async () => {
  const [artists, artworks, events, news] = await Promise.all([
    fetchAllPages('/api/public/artists', 100),
    fetchAllPages('/api/public/artworks', 100, maxArtworks),
    fetchAllPages('/api/public/events', 100),
    fetchAllPages('/api/public/news', 100),
  ]);

  const artworkKeys = new Set();
  artworks.forEach((artwork) => {
    if (artwork.slug) artworkKeys.add(artwork.slug);
    if (artwork.slugEn) artworkKeys.add(artwork.slugEn);
    if (artwork.id) artworkKeys.add(artwork.id);
  });

  const routes = new Set();

  locales.forEach((locale) => {
    staticPaths.forEach((pathSuffix) => {
      routes.add(`/${locale}${pathSuffix}`);
    });

    artists.forEach((artist) => {
      if (artist.id) routes.add(`/${locale}/artists/${artist.id}`);
    });

    artworkKeys.forEach((key) => {
      routes.add(`/${locale}/collection/${key}`);
    });

    events.forEach((event) => {
      if (event.slug) routes.add(`/${locale}/events/${event.slug}`);
    });

    news.forEach((article) => {
      if (article.slug) routes.add(`/${locale}/news/${article.slug}`);
    });
  });

  return Array.from(routes);
};

const writeSitemap = async (routes) => {
  const urls = routes.map((route) => `${siteUrl}${route}`);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((loc) => `  <url><loc>${loc}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');

  await fs.writeFile(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
  console.info('[Prerender] sitemap.xml generated', { count: urls.length });
};

const renderRoutes = async (routes) => {
  const serve = sirv(distDir, { single: true });
  const server = http.createServer((req, res) => serve(req, res));

  await new Promise((resolve) => server.listen(port, resolve));
  console.info('[Prerender] Static server started', { port });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const route of routes) {
    const url = `http://localhost:${port}${basePath}${route}`;
    console.info('[Prerender] Rendering', { route, url });
    await page.goto(url, { waitUntil: 'networkidle' });
    const html = await page.content();

    const outputPath = route === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.replace(/^\//, ''), 'index.html');

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html, 'utf8');
  }

  await browser.close();
  server.close();
  console.info('[Prerender] Completed', { total: routes.length });
};

const run = async () => {
  console.info('[Prerender] Starting prerender', { apiUrl, siteUrl, maxArtworks });

  const routes = await buildRoutes();
  await writeSitemap(routes);
  await renderRoutes(routes);
};

run().catch((error) => {
  console.error('[Prerender] Failed', { error });
  process.exit(1);
});
