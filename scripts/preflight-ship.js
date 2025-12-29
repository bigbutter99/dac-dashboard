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

console.log('Preflight OK: Node version and local dependencies are ready.');
