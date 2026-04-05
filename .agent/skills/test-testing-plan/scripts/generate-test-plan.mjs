import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');

const planPath = '/Users/ktran/.cursor/plans/gh_pages_frontend_migration_9351a008.plan.md';
const statusPath = path.join(repoRoot, '.agent', 'skills', 'tech-dev-process-implementation', 'SKILL.md');
const outputDir = path.join(repoRoot, '.agent', 'skills', 'test-testing-plan', 'plans');

const acRegex = /^- AC-(\d+):\s*(.*)$/;

const acKeywordMap = {
  'AC-01': ['locale', 'routing'],
  'AC-02': ['home', 'collection', 'artists', 'events', 'news', 'knowledge', 'who we are'],
  'AC-03': ['detail', 'real data', 'backend', 'public api'],
  'AC-04': ['artwork', 'slug', 'id'],
  'AC-05': ['public api', 'api', 'backend'],
  'AC-06': ['prerender', 'sitemap', 'static html'],
  'AC-07': ['gh pages', 'deploy', 'workflow'],
  'AC-08': ['test runner', 'run report', 'issues'],
};

const testCaseTemplates = {
  'AC-01': {
    title: 'Locale routing works for vi/en',
    preconditions: 'GH Pages URL is reachable.',
    steps: [
      'Open `/` and confirm redirect to `/vi`.',
      'Use language toggle to switch to `/en`.',
    ],
    expected: 'Locale prefix updates and content loads without errors.',
    evidence: 'Screenshot (vi/en), URL, console log.',
  },
  'AC-02': {
    title: 'Primary routes render with expected layout',
    preconditions: 'GH Pages URL is reachable.',
    steps: [
      'Visit `/vi`, `/vi/collection`, `/vi/artists`, `/vi/events`, `/vi/news`.',
      'Visit `/vi/knowledge`, `/vi/who-we-are`.',
    ],
    expected: 'Pages render with header, sidebar, footer, and core sections.',
    evidence: 'Screenshots per route, console log.',
  },
  'AC-03': {
    title: 'Detail pages load real backend data',
    preconditions: 'Backend public API reachable from browser.',
    steps: [
      'Open first item from Collection, Artists, Events, News lists.',
      'Confirm details render with fetched data.',
    ],
    expected: 'Detail pages show API-backed content without mock placeholders.',
    evidence: 'Screenshots, network log for `/api/public/*`.',
  },
  'AC-04': {
    title: 'Artwork detail supports id and slug keys',
    preconditions: 'Collection list is loaded.',
    steps: [
      'Open a collection detail using slug.',
      'Open a collection detail using id if available.',
    ],
    expected: 'Both routes resolve to the correct artwork detail.',
    evidence: 'Screenshots and URL logs.',
  },
  'AC-05': {
    title: 'Public API calls work without mocks',
    preconditions: 'Backend public API is reachable.',
    steps: [
      'Load Home, Collection, Artists, Events, News pages.',
      'Confirm API calls succeed in network log.',
    ],
    expected: 'No mock data paths are used; API responses are OK.',
    evidence: 'Network log and console log.',
  },
  'AC-06': {
    title: 'Static HTML + sitemap are generated',
    preconditions: 'Build pipeline completed.',
    steps: [
      'Check `dist/` for prerendered route HTML.',
      'Fetch `sitemap.xml` from output.',
    ],
    expected: 'HTML exists per route and sitemap lists locale + detail URLs.',
    evidence: 'File listing, sitemap output.',
  },
  'AC-07': {
    title: 'GH Pages deployment works with base path',
    preconditions: 'GitHub Actions deployment completed.',
    steps: [
      'Open `https://dangkhoaow.github.io/av-foundation-frontend-web/`.',
      'Verify assets load from `/av-foundation-frontend-web/` base path.',
    ],
    expected: 'Site loads with correct assets and routing.',
    evidence: 'Screenshots, network log.',
  },
  'AC-08': {
    title: 'Test runner outputs dated reports and issues list',
    preconditions: 'Test plan generated, Playwright installed.',
    steps: [
      'Run `npm run test:runner`.',
      'Confirm dated run + issues files are written.',
    ],
    expected: 'Run report and issues list are created with timestamp.',
    evidence: 'Files under `.agent/skills/test-runner/*`.',
  },
};

const formatTimestamp = (date = new Date()) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}${mm}${dd}-${hh}${min}`;
};

const loadPlanACs = async () => {
  const content = await fs.readFile(planPath, 'utf8');
  const lines = content.split('\n');
  const acs = [];

  lines.forEach((line) => {
    const match = line.match(acRegex);
    if (match) {
      acs.push({ id: `AC-${match[1]}`, title: match[2].trim() });
    }
  });

  return acs;
};

const loadStatusText = async () => {
  const content = await fs.readFile(statusPath, 'utf8');
  const currentStatusIndex = content.indexOf('## Current status');
  if (currentStatusIndex === -1) {
    return content.toLowerCase();
  }

  return content.slice(currentStatusIndex).toLowerCase();
};

const isImplemented = (acId, statusText) => {
  const keywords = acKeywordMap[acId] || [];
  return keywords.some((keyword) => statusText.includes(keyword));
};

const buildTestCase = (acId) => {
  const template = testCaseTemplates[acId];
  if (!template) return null;

  return [
    `### ${acId}: ${template.title}`,
    `Preconditions: ${template.preconditions}`,
    `Steps:`,
    ...template.steps.map((step) => `- ${step}`),
    `Expected: ${template.expected}`,
    `Evidence: ${template.evidence}`,
    '',
  ].join('\n');
};

const run = async () => {
  console.info('[TestPlan] Generating test plan', { planPath, statusPath });

  const [acs, statusText] = await Promise.all([loadPlanACs(), loadStatusText()]);
  const implemented = acs.filter((ac) => isImplemented(ac.id, statusText));

  console.info('[TestPlan] ACs detected', { total: acs.length, implemented: implemented.length });

  const timestamp = formatTimestamp();
  const outputPath = path.join(outputDir, `test-plan-${timestamp}.md`);

  const lines = [
    `# Test Plan ${timestamp}`,
    '',
    '## Scope',
    implemented.length
      ? implemented.map((ac) => `- ${ac.id}: ${ac.title}`).join('\n')
      : '- No implemented ACs detected; update tech-dev-process-implementation.',
    '',
    '## Testcases',
  ];

  implemented.forEach((ac) => {
    const testCase = buildTestCase(ac.id);
    if (testCase) {
      lines.push(testCase);
    }
  });

  await fs.writeFile(outputPath, lines.join('\n'), 'utf8');
  console.info('[TestPlan] Test plan written', { outputPath });
};

run().catch((error) => {
  console.error('[TestPlan] Failed to generate test plan', { error });
  process.exit(1);
});
