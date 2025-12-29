const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const requiredMin = [18, 17, 1];
const requiredMax = [19, 0, 0];

const parseVersion = (raw) => raw.replace(/^v/, '').split('.').map((part) => Number(part));

const compareVersions = (a, b) => {
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    const left = a[i] ?? 0;
    const right = b[i] ?? 0;
    if (left > right) {
      return 1;
    }
    if (left < right) {
      return -1;
    }
  }
  return 0;
};

const current = parseVersion(process.version);
if (compareVersions(current, requiredMin) < 0 || compareVersions(current, requiredMax) >= 0) {
  console.error('Preflight failed: Unsupported Node.js version.');
  console.error(`Required: >=${requiredMin.join('.')} <${requiredMax.join('.')}`);
  console.error(`Current: ${process.version}`);
  console.error('Use Node 18.x (example: 18.19.1) before running ship builds.');
  process.exit(1);
}

const allowUnsupportedNpm = process.env.DAC_DASHBOARD_ALLOW_UNSUPPORTED_NPM === '1';
try {
  const npmVersionRaw = execSync('npm --version', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  const npmVersion = parseVersion(npmVersionRaw);
  if (npmVersion[0] >= 11) {
    const header = allowUnsupportedNpm ? 'Preflight warning' : 'Preflight failed';
    console.error(`${header}: Unsupported npm version for Node ${process.version}.`);
    console.error(`Recommended: npm 9 or 10 with Node 18.x (current npm: ${npmVersionRaw}).`);
    console.error('Fix: install Node 18 LTS that ships with npm 10, or run `npm i -g npm@10`.');
    if (!allowUnsupportedNpm) {
      console.error('Override (not recommended): set `DAC_DASHBOARD_ALLOW_UNSUPPORTED_NPM=1`.');
      process.exit(1);
    }
  }
} catch (error) {
  console.error('Preflight warning: Unable to determine npm version via `npm --version`.');
}

const requireFile = (relativePath, label) => {
  const fullPath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Preflight failed: Missing ${label}.`);
    console.error(`Expected: ${relativePath}`);
    console.error('Run `npm ci` and try again.');
    process.exit(1);
  }
};

requireFile('node_modules/gulp/package.json', 'local gulp dependency');
requireFile('node_modules/@microsoft/sp-build-web/package.json', 'SPFx build toolchain');

const repoRoot = process.cwd();

const stripJsonComments = (input) => {
  let output = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    const next = input[i + 1];

    if (inString) {
      output += ch;
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      output += ch;
      continue;
    }

    if (ch === '/' && next === '/') {
      while (i < input.length && input[i] !== '\n') {
        i += 1;
      }
      output += '\n';
      continue;
    }

    if (ch === '/' && next === '*') {
      i += 2;
      while (i < input.length && !(input[i] === '*' && input[i + 1] === '/')) {
        i += 1;
      }
      i += 1;
      continue;
    }

    output += ch;
  }

  return output;
};

const readJson = (relativePath, label) => {
  const fullPath = path.join(repoRoot, relativePath);
  try {
    const raw = fs.readFileSync(fullPath, 'utf8');
    const parsed = JSON.parse(stripJsonComments(raw));
    return parsed;
  } catch (error) {
    console.error(`Preflight failed: Unable to read ${label}.`);
    console.error(`Expected valid JSON at: ${relativePath}`);
    process.exit(1);
  }
};

const walkFiles = (dir, results = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'lib' || entry.name === 'dist' || entry.name === 'release') {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, results);
    } else {
      results.push(fullPath);
    }
  }
  return results;
};

const assertNoMatches = (label, filePaths, pattern, hint) => {
  for (const filePath of filePaths) {
    const contents = fs.readFileSync(filePath, 'utf8');
    if (pattern.test(contents)) {
      const relative = path.relative(repoRoot, filePath);
      console.error(`Preflight failed: ${label}`);
      console.error(`Found match in: ${relative}`);
      if (hint) {
        console.error(hint);
      }
      process.exit(1);
    }
  }
};

const manifest = readJson(
  'src/webparts/dacDashboard/DacDashboardWebPart.manifest.json',
  'SPFx web part manifest'
);
const supportedHosts = Array.isArray(manifest.supportedHosts) ? manifest.supportedHosts : [];
if (supportedHosts.some((host) => typeof host === 'string' && host.toLowerCase().includes('teams'))) {
  console.error('Preflight failed: Teams hosts are enabled in supportedHosts.');
  console.error('Pilot is SharePoint-only; remove Teams hosts from supportedHosts in: src/webparts/dacDashboard/DacDashboardWebPart.manifest.json');
  process.exit(1);
}

const configFiles = [
  path.join(repoRoot, 'config', 'write-manifests.json'),
  path.join(repoRoot, 'config', 'deploy-azure-storage.json'),
  path.join(repoRoot, 'config', 'serve.json')
].filter((filePath) => fs.existsSync(filePath));

assertNoMatches(
  'Placeholder tokens still exist in config (<!-- ... -->).',
  configFiles,
  /<!--\s*[^>]+-->/,
  'Replace placeholders with concrete values or empty strings before shipping.'
);

const spfxSourceRoot = path.join(repoRoot, 'src', 'webparts', 'dacDashboard');
if (fs.existsSync(spfxSourceRoot)) {
  const sourceFiles = walkFiles(spfxSourceRoot).filter((filePath) => /\.(ts|tsx|scss|json)$/i.test(filePath));
  assertNoMatches(
    'External mock image URLs detected (placehold.co / images.unsplash.com).',
    sourceFiles,
    /https?:\/\/(?:placehold\.co|images\.unsplash\.com)\b/i,
    'Mock mode must be offline-capable: use data:image SVGs or local assets.'
  );
}

console.log('Preflight OK: Node version and local dependencies are ready.');
