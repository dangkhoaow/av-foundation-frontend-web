import path from 'path';
import { fileURLToPath } from 'url';
import { formatTimestamp, findLatestPlan, resolveUrl, generateVisualManifest, runPlaywrightPhase } from './test-runner-visual.mjs';
import { writeRunReport, writeIssueList, postGitHubIssues } from './test-runner-report.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const skillsRoot = path.join(repoRoot, '.agent', 'skills', 'test-runner');
const runsDir = path.join(skillsRoot, 'runs');
const issuesDir = path.join(skillsRoot, 'issues');
const visualRoot = path.join(skillsRoot, 'visual');
const plansDir = path.join(repoRoot, '.agent', 'skills', 'test-testing-plan', 'plans');
const defaultBaselineBaseUrl = 'http://av-foundation-frontend-uat.us-east-1.elasticbeanstalk.com';
const defaultCompareBaseUrl = 'https://dangkhoaow.github.io/av-foundation-frontend-web/';

const run = async () => {
  const timestamp = formatTimestamp();
  const planPath = await findLatestPlan(plansDir);
  let visualEnabled = process.env.VISUAL_ENABLED !== 'false';
  const compareBaseUrl = resolveUrl(process.env.E2E_BASE_URL, defaultCompareBaseUrl);
  const baselineBaseUrl = resolveUrl(process.env.BASELINE_BASE_URL, defaultBaselineBaseUrl);
  const visualApiUrl = process.env.VISUAL_API_URL || process.env.VITE_API_URL || process.env.API_URL || 'https://d3te863nebxng5.cloudfront.net';
  const runRoot = path.join(visualRoot, timestamp);
  const manifestPath = path.join(runRoot, 'manifests', `visual-manifest-${timestamp}.json`);
  const baselineOutputDir = path.join(runRoot, 'baseline');
  const compareOutputDir = path.join(runRoot, 'compare');
  const functionalOutputDir = path.join(runRoot, 'functional');
  const baselineSnapshotDir = path.join(baselineOutputDir, 'snapshots');
  let visualManifest = null;

  console.info('[Runner] Starting test run', { timestamp, planPath, visualEnabled, baselineBaseUrl, compareBaseUrl });

  if (visualEnabled) {
    try {
      visualManifest = await generateVisualManifest({ manifestPath, apiUrl: visualApiUrl });
    } catch (error) {
      visualEnabled = false;
      console.error('[Runner] Visual manifest generation failed, skipping visual phases', { error });
    }
  }

  const phases = [];
  if (visualEnabled) {
    phases.push(await runPlaywrightPhase({
      phaseName: 'baseline',
      label: 'Baseline visual',
      baseUrl: baselineBaseUrl,
      outputDir: baselineOutputDir,
      snapshotDir: baselineSnapshotDir,
      manifestPath,
      grepArgs: ['--grep', '@visual'],
      updateSnapshots: true,
    }));

    phases.push(await runPlaywrightPhase({
      phaseName: 'compare',
      label: 'Compare visual',
      baseUrl: compareBaseUrl,
      outputDir: compareOutputDir,
      snapshotDir: baselineSnapshotDir,
      manifestPath,
      grepArgs: ['--grep', '@visual'],
    }));
  }

  phases.push(await runPlaywrightPhase({
    phaseName: 'functional',
    label: 'Functional E2E',
    baseUrl: compareBaseUrl,
    outputDir: functionalOutputDir,
    snapshotDir: path.join(functionalOutputDir, 'snapshots'),
    manifestPath: visualEnabled ? manifestPath : null,
    grepArgs: ['--grep-invert', '@visual'],
  }));

  const exitCode = phases.reduce((currentMax, phase) => Math.max(currentMax, phase.exitCode), 0);
  const reportPath = await writeRunReport({
    runsDir,
    timestamp,
    planPath,
    visualEnabled,
    baselineBaseUrl,
    compareBaseUrl,
    manifestPath: visualEnabled ? manifestPath : null,
    manifestSummary: visualManifest?.summary || null,
    phases,
  });
  await writeIssueList({ issuesDir, timestamp, phases });
  await postGitHubIssues({ phases, reportPath });

  if (exitCode !== 0) {
    process.exit(exitCode);
  }
};

run().catch((error) => {
  console.error('[Runner] Failed', { error });
  process.exit(1);
});
