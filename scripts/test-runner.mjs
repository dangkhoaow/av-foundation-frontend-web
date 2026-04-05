import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const skillsRoot = path.join(repoRoot, '.agent', 'skills', 'test-runner');
const runsDir = path.join(skillsRoot, 'runs');
const issuesDir = path.join(skillsRoot, 'issues');
const plansDir = path.join(repoRoot, '.agent', 'skills', 'test-testing-plan', 'plans');

const formatTimestamp = (date = new Date()) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}${mm}${dd}-${hh}${min}`;
};

const findLatestPlan = async () => {
  try {
    const files = await fs.readdir(plansDir);
    const planFiles = files.filter((file) => file.startsWith('test-plan-') && file.endsWith('.md'));
    if (planFiles.length === 0) return null;
    const sorted = planFiles.sort();
    return path.join(plansDir, sorted[sorted.length - 1]);
  } catch (error) {
    console.warn('[Runner] No test plans found', { error });
    return null;
  }
};

const runPlaywright = () =>
  new Promise((resolve) => {
    const child = spawn('npx', ['playwright', 'test'], {
      stdio: 'inherit',
      env: process.env,
      cwd: repoRoot,
      shell: true,
    });

    child.on('exit', (code) => {
      resolve(code ?? 1);
    });
  });

const collectFailures = (suite, parentTitles = []) => {
  const currentTitles = suite.title ? [...parentTitles, suite.title] : parentTitles;
  const failures = [];

  if (suite.specs) {
    suite.specs.forEach((spec) => {
      spec.tests?.forEach((test) => {
        const failedResult = test.results?.find((result) => result.status === 'failed' || result.status === 'timedOut');
        if (failedResult) {
          failures.push({
            title: [...currentTitles, spec.title, test.title].filter(Boolean).join(' > '),
            status: failedResult.status,
            error: failedResult.error?.message || 'Unknown error',
          });
        }
      });
    });
  }

  if (suite.suites) {
    suite.suites.forEach((child) => {
      failures.push(...collectFailures(child, currentTitles));
    });
  }

  return failures;
};

const loadResults = async () => {
  const resultsPath = path.join(repoRoot, 'test-results', 'results.json');
  try {
    const raw = await fs.readFile(resultsPath, 'utf8');
    const data = JSON.parse(raw);
    const failures = collectFailures(data, []);
    return { failures, resultsPath };
  } catch (error) {
    console.warn('[Runner] Failed to load Playwright results', { error });
    return { failures: [], resultsPath: null };
  }
};

const writeRunReport = async ({ timestamp, planPath, failures, exitCode, resultsPath }) => {
  await fs.mkdir(runsDir, { recursive: true });

  const reportPath = path.join(runsDir, `test-run-${timestamp}.md`);
  const lines = [
    `# Test Run ${timestamp}`,
    '',
    '## Plan used',
    planPath ? `- ${planPath}` : '- No plan found',
    '',
    '## Summary',
    `- Exit code: ${exitCode}`,
    `- Failures: ${failures.length}`,
    '',
    '## Failures',
    failures.length
      ? failures.map((failure) => `- ${failure.title} (${failure.status})`).join('\n')
      : '- None',
    '',
    '## Artifacts',
    resultsPath ? `- ${resultsPath}` : '- No JSON report found',
    '- playwright-report/',
    '',
  ];

  await fs.writeFile(reportPath, lines.join('\n'), 'utf8');
  console.info('[Runner] Run report written', { reportPath });
  return reportPath;
};

const writeIssueList = async ({ timestamp, failures, reportPath }) => {
  await fs.mkdir(issuesDir, { recursive: true });

  const issuesPath = path.join(issuesDir, `issues-${timestamp}.md`);
  const lines = [
    `# Issues ${timestamp}`,
    '',
    ...(failures.length
      ? failures.map((failure) => [
          `- Title: E2E failure - ${failure.title}`,
          '  Severity: high',
          `  Steps: ${failure.title}`,
          '  Expected: Scenario passes without errors',
          `  Actual: ${failure.error}`,
          `  Evidence: ${reportPath}`,
          '',
        ].join('\n'))
      : ['- No failures detected', '']),
  ];

  await fs.writeFile(issuesPath, lines.join('\n'), 'utf8');
  console.info('[Runner] Issue list written', { issuesPath });
  return issuesPath;
};

const postGitHubIssues = async ({ failures, reportPath }) => {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || 'dangkhoaow/av-foundation-frontend-web';
  const issuesEnabled = process.env.ISSUES_ENABLED === 'true';

  if (!issuesEnabled || !token || failures.length === 0) {
    console.info('[Runner] Issue posting skipped', { issuesEnabled, hasToken: Boolean(token), failures: failures.length });
    return;
  }

  for (const failure of failures) {
    const body = [
      `## Summary`,
      `E2E failure detected.`,
      '',
      `## Scenario`,
      failure.title,
      '',
      `## Error`,
      failure.error,
      '',
      `## Evidence`,
      reportPath,
    ].join('\n');

    const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'av-foundation-test-runner',
      },
      body: JSON.stringify({
        title: `E2E failure - ${failure.title}`,
        body,
      }),
    });

    if (!response.ok) {
      const errorPayload = await response.text();
      console.error('[Runner] Failed to post issue', { status: response.status, errorPayload });
      continue;
    }

    const issue = await response.json();
    console.info('[Runner] Issue created', { url: issue?.html_url });
  }
};

const run = async () => {
  const timestamp = formatTimestamp();
  const planPath = await findLatestPlan();

  console.info('[Runner] Starting test run', { timestamp, planPath });
  const exitCode = await runPlaywright();
  const { failures, resultsPath } = await loadResults();

  const reportPath = await writeRunReport({ timestamp, planPath, failures, exitCode, resultsPath });
  await writeIssueList({ timestamp, failures, reportPath });
  await postGitHubIssues({ failures, reportPath });

  if (exitCode !== 0) {
    process.exit(exitCode);
  }
};

run().catch((error) => {
  console.error('[Runner] Failed', { error });
  process.exit(1);
});
