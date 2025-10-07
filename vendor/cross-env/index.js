#!/usr/bin/env node
const { spawn } = require('node:child_process');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('[cross-env] Missing command to run.');
  process.exit(1);
}

const env = { ...process.env };
let commandIndex = 0;
for (; commandIndex < args.length; commandIndex += 1) {
  const candidate = args[commandIndex];
  if (!candidate.includes('=')) {
    break;
  }
  const eqIndex = candidate.indexOf('=');
  const key = candidate.slice(0, eqIndex);
  const rawValue = candidate.slice(eqIndex + 1);

  const expansionMatch = rawValue.match(/^\$\{([^:}]+):-?([^}]*)\}$/);
  if (expansionMatch) {
    const [, varName, fallback] = expansionMatch;
    const resolved = process.env[varName] ?? fallback;
    env[key] = resolved === undefined ? '' : resolved;
    continue;
  }

  if (rawValue.startsWith('$')) {
    const varName = rawValue.slice(1);
    env[key] = process.env[varName] ?? '';
    continue;
  }

  env[key] = rawValue;
}

const command = args[commandIndex];
if (!command) {
  console.error('[cross-env] Missing executable command.');
  process.exit(1);
}

const commandArgs = args.slice(commandIndex + 1);
const child = spawn(command, commandArgs, {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
