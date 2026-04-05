import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildRouteManifest } from './route-manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const formatTimestamp = (date = new Date()) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}${mm}${dd}-${hh}${min}`;
};

const parsePositiveInt = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const getManifestPath = () => {
  if (process.env.VISUAL_MANIFEST_OUTPUT) {
    return path.resolve(repoRoot, process.env.VISUAL_MANIFEST_OUTPUT);
  }

  return path.join(repoRoot, '.agent', 'skills', 'test-runner', 'visual', 'manifests', `visual-manifest-${formatTimestamp()}.json`);
};

const run = async () => {
  const manifestPath = getManifestPath();
  const apiUrl =
    process.env.VISUAL_API_URL ||
    process.env.VITE_API_URL ||
    process.env.API_URL ||
    'https://d3te863nebxng5.cloudfront.net';

  const manifest = await buildRouteManifest({
    apiUrl,
    locales: process.env.VISUAL_LOCALES || 'vi,en',
    maxArtists: parsePositiveInt(process.env.VISUAL_MAX_ARTISTS),
    maxArtworks: parsePositiveInt(process.env.VISUAL_MAX_ARTWORKS),
    maxEvents: parsePositiveInt(process.env.VISUAL_MAX_EVENTS),
    maxNews: parsePositiveInt(process.env.VISUAL_MAX_NEWS),
    staticOnly: process.env.VISUAL_STATIC_ONLY === 'true',
  });

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.info('[VisualManifest] Wrote manifest', {
    manifestPath,
    routeCount: manifest.routes.length,
    summary: manifest.summary,
  });
};

run().catch((error) => {
  console.error('[VisualManifest] Failed', { error });
  process.exit(1);
});
