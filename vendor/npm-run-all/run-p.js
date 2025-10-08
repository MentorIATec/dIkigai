#!/usr/bin/env node
const { spawn } = require('child_process');

const scripts = process.argv.slice(2);
if (scripts.length === 0) {
  console.error('run-p requires at least one script');
  process.exit(1);
}

const processes = scripts.map((script) => {
  return spawn('npm', ['run', script], { stdio: 'inherit', shell: process.platform === 'win32' });
});

process.on('SIGINT', () => {
  processes.forEach((child) => child.kill('SIGINT'));
  process.exit(1);
});
