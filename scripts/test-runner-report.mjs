import fs from 'fs/promises';
import path from 'path';

export const toRepoRelative = (filePath) => (path.isAbsolute(filePath) ? path.relative(process.cwd(), filePath) : filePath);

export const formatFailureDetails = (failure) => [
  `- Title: ${failure.title}`,
  `  Phase: ${failure.phase}`,
  failure.kind ? `  Kind: ${failure.kind}` : null,
  failure.locale ? `  Locale: ${failure.locale}` : null,
  failure.routePath ? `  Route: ${failure.routePath}` : null,
  `  Viewport: ${failure.projectName}`,
  `  Status: ${failure.status}`,
  `  Error: ${failure.error}`,
  failure.attachments.length ? `  Evidence: ${failure.attachments.map((attachment) => toRepoRelative(attachment)).join(', ')}` : null,
].filter(Boolean).join('\n');

export const writeRunReport = async ({
  runsDir,
  timestamp,
  planPath,
  visualEnabled,
  baselineBaseUrl,
  compareBaseUrl,
  manifestPath,
  manifestSummary,
  phases,
}) => {
  await fs.mkdir(runsDir, { recursive: true });
  const reportPath = path.join(runsDir, `test-run-${timestamp}.md`);
  const lines = [
    `# Test Run ${timestamp}`,
    '',
    '## Plan used',
    planPath ? `- ${toRepoRelative(planPath)}` : '- No plan found',
    '',
    '## Configuration',
    `- Visual enabled: ${visualEnabled ? 'yes' : 'no'}`,
    `- Baseline URL: ${baselineBaseUrl}`,
    `- Compare URL: ${compareBaseUrl}`,
    manifestPath ? `- Visual manifest: ${toRepoRelative(manifestPath)}` : '- Visual manifest: not generated',
  ];

  if (manifestSummary) {
    lines.push('- Visual manifest summary:');
    lines.push(`  - Routes: ${manifestSummary.totalRoutes}`);
    lines.push(`  - Locales: ${(manifestSummary.locales || []).join(', ')}`);
    lines.push(`  - Artists: ${manifestSummary.artists}`);
    lines.push(`  - Artworks: ${manifestSummary.artworks}`);
    lines.push(`  - Events: ${manifestSummary.events}`);
    lines.push(`  - News: ${manifestSummary.news}`);
  }

  lines.push('', '## Phase Results');
  phases.forEach((phase) => {
    lines.push(
      `### ${phase.label}`,
      `- Exit code: ${phase.exitCode}`,
      `- Failures: ${phase.failures.length}`,
      `- Results: ${toRepoRelative(phase.resultsPath)}`,
      phase.evidence.length ? '- Evidence:' : '- Evidence: none',
      ...phase.evidence.slice(0, 5).map((file) => `  - ${toRepoRelative(file)}`),
      ''
    );
  });

  const referenceFailures = phases.filter((phase) => phase.name === 'baseline').flatMap((phase) => phase.failures);
  const visualFailures = phases.filter((phase) => phase.name === 'compare').flatMap((phase) => phase.failures);
  const functionalFailures = phases.filter((phase) => phase.name === 'functional').flatMap((phase) => phase.failures);

  lines.push('## Failures', '');
  lines.push('### Reference failures');
  lines.push(referenceFailures.length ? referenceFailures.map((failure) => formatFailureDetails(failure)).join('\n\n') : '- None');
  lines.push('');
  lines.push('### Visual diff failures');
  lines.push(visualFailures.length ? visualFailures.map((failure) => formatFailureDetails(failure)).join('\n\n') : '- None');
  lines.push('');
  lines.push('### Functional failures');
  lines.push(functionalFailures.length ? functionalFailures.map((failure) => formatFailureDetails(failure)).join('\n\n') : '- None');
  lines.push('');

  await fs.writeFile(reportPath, lines.join('\n'), 'utf8');
  console.info('[Runner] Run report written', { reportPath });
  return reportPath;
};

export const writeIssueList = async ({ issuesDir, timestamp, phases }) => {
  await fs.mkdir(issuesDir, { recursive: true });
  const issuesPath = path.join(issuesDir, `issues-${timestamp}.md`);
  const visualFailures = phases.filter((phase) => phase.name === 'compare').flatMap((phase) => phase.failures);
  const functionalFailures = phases.filter((phase) => phase.name === 'functional').flatMap((phase) => phase.failures);
  const lines = [
    `# Issues ${timestamp}`,
    '',
    '## Visual Failures',
    visualFailures.length ? visualFailures.map((failure) => formatFailureDetails(failure)).join('\n\n') : '- None',
    '',
    '## Functional Failures',
    functionalFailures.length ? functionalFailures.map((failure) => formatFailureDetails(failure)).join('\n\n') : '- None',
    '',
  ];

  await fs.writeFile(issuesPath, lines.join('\n'), 'utf8');
  console.info('[Runner] Issue list written', { issuesPath });
  return issuesPath;
};

export const postGitHubIssues = async ({ phases, reportPath }) => {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || 'dangkhoaow/av-foundation-frontend-web';
  const issuesEnabled = process.env.ISSUES_ENABLED === 'true';
  const failures = phases.filter((phase) => phase.name !== 'baseline').flatMap((phase) => phase.failures);

  if (!issuesEnabled || !token || failures.length === 0) {
    console.info('[Runner] Issue posting skipped', { issuesEnabled, hasToken: Boolean(token), failures: failures.length });
    return;
  }

  for (const failure of failures) {
    const isVisual = Boolean(failure.routePath);
    const body = [
      '## Summary',
      isVisual ? 'Visual regression detected.' : 'Functional E2E failure detected.',
      '',
      '## Scenario',
      failure.title,
      '',
      failure.routePath ? `## Route\n${failure.routePath}` : null,
      failure.locale ? `## Locale\n${failure.locale}` : null,
      `## Viewport\n${failure.projectName}`,
      '## Error',
      failure.error,
      '',
      '## Evidence',
      failure.attachments.length ? failure.attachments.map((attachment) => toRepoRelative(attachment)).join('\n') : toRepoRelative(reportPath),
    ].join('\n');

    const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'av-foundation-test-runner',
      },
      body: JSON.stringify({
        title: isVisual
          ? `Visual diff - ${failure.routePath || failure.title} [${failure.projectName}]`
          : `E2E failure - ${failure.title}`,
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
