import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

export const formatTimestamp = (date = new Date()) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}${mm}${dd}-${hh}${min}`;
};

export const findLatestPlan = async (plansDir) => {
  try {
    const files = await fs.readdir(plansDir);
    const planFiles = files.filter((file) => file.startsWith('test-plan-') && file.endsWith('.md'));
    if (!planFiles.length) return null;
    planFiles.sort();
    return path.join(plansDir, planFiles[planFiles.length - 1]);
  } catch (error) {
    console.warn('[Runner] No test plans found', { error });
    return null;
  }
};

export const resolveUrl = (value, fallback) => (value || fallback).replace(/\/$/, '');

const readJson = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const collectFiles = async (dir) => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await collectFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  } catch {
    return [];
  }
};

const collectEvidenceFiles = async (dir) =>
  (await collectFiles(dir)).filter((file) => /(-diff\.png$|-actual\.png$|-expected\.png$|trace\.zip$|\.webm$)/i.test(file));

const parseVisualTitle = (title) => {
  const match = title.match(/^(.*?) @visual ([^ ]+) (.+)$/);
  if (!match) return null;
  return { kind: match[1], locale: match[2], routePath: match[3] };
};

const runCommand = (command, args, env, label) =>
  new Promise((resolve) => {
    console.info('[Runner] Running command', { label, command, args });
    const executable = process.platform === 'win32' && command === 'npx' ? 'npx.cmd' : command;
    const child = spawn(executable, args, {
      stdio: 'inherit',
      env,
      cwd: process.cwd(),
      shell: false,
    });

    child.on('exit', (code) => resolve(code ?? 1));
    child.on('error', (error) => {
      console.error('[Runner] Command failed to start', { label, error });
      resolve(1);
    });
  });

export const generateVisualManifest = async ({ manifestPath, apiUrl, env = process.env }) => {
  const scriptPath = path.join(process.cwd(), 'scripts', 'generate-visual-manifest.mjs');
  const exitCode = await runCommand('node', [scriptPath], {
    ...env,
    VISUAL_MANIFEST_OUTPUT: manifestPath,
    VISUAL_API_URL: apiUrl,
  }, 'Generate visual manifest');

  if (exitCode !== 0) {
    throw new Error(`Visual manifest generation failed with exit code ${exitCode}`);
  }

  return readJson(manifestPath);
};

const collectFailures = (results, phaseName) => {
  const failures = [];
  const visitSuite = (suite, parentTitles = []) => {
    const currentTitles = suite.title ? [...parentTitles, suite.title] : parentTitles;

    suite.specs?.forEach((spec) => {
      spec.tests?.forEach((test) => {
        const failedResult = test.results?.find((result) => result.status === 'failed' || result.status === 'timedOut');
        if (!failedResult) return;

        const visualMeta = parseVisualTitle(spec.title);
        failures.push({
          phase: phaseName,
          title: [...currentTitles, spec.title].filter(Boolean).join(' > '),
          specTitle: spec.title,
          projectName: test.projectName || 'default',
          status: failedResult.status,
          error: failedResult.error?.message || 'Unknown error',
          attachments: failedResult.attachments?.map((attachment) => attachment.path).filter(Boolean) || [],
          routePath: visualMeta?.routePath || null,
          locale: visualMeta?.locale || null,
          kind: visualMeta?.kind || null,
        });
      });
    });

    suite.suites?.forEach((child) => visitSuite(child, currentTitles));
  };

  results?.suites?.forEach((suite) => visitSuite(suite));
  return failures;
};

export const loadResults = async (resultsPath, phaseName) => {
  const data = await readJson(resultsPath);
  return { failures: collectFailures(data, phaseName), resultsPath };
};

export const runPlaywrightPhase = async ({
  phaseName,
  label,
  baseUrl,
  outputDir,
  snapshotDir,
  manifestPath,
  grepArgs,
  updateSnapshots = false,
  env = process.env,
}) => {
  await fs.mkdir(outputDir, { recursive: true });
  if (snapshotDir) await fs.mkdir(snapshotDir, { recursive: true });

  const resultsPath = path.join(outputDir, 'results.json');
  const htmlOutput = path.join(path.dirname(outputDir), `${path.basename(outputDir)}-playwright-report`);
  const args = ['playwright', 'test', ...grepArgs];
  if (updateSnapshots) args.push('--update-snapshots');

  const exitCode = await runCommand('npx', args, {
    ...env,
    E2E_BASE_URL: baseUrl,
    PLAYWRIGHT_OUTPUT_DIR: outputDir,
    PLAYWRIGHT_JSON_OUTPUT: resultsPath,
    PLAYWRIGHT_HTML_OUTPUT: htmlOutput,
    ...(snapshotDir ? { VISUAL_SNAPSHOT_DIR: snapshotDir } : {}),
    ...(manifestPath ? { VISUAL_MANIFEST_PATH: manifestPath } : {}),
  }, label);

  const { failures } = await loadResults(resultsPath, phaseName);
  const evidence = await collectEvidenceFiles(outputDir);
  return { name: phaseName, label, baseUrl, outputDir, resultsPath, exitCode, failures, evidence };
};
