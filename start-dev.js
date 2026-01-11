#!/usr/bin/env node

/**
 * Combined Start Script for Watch Store
 * Starts both backend (auth-server) and frontend (vite) servers
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const isWindows = os.platform() === 'win32';
const projectRoot = __dirname;

console.log('\n🚀 Starting Watch Store Development Environment');
console.log('===============================================\n');

// Backend server
console.log('📡 Starting Auth Server (http://localhost:4000)...');
const backendProcess = spawn(
  isWindows ? 'npm.cmd' : 'npm',
  ['run', 'server'],
  {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: isWindows
  }
);

// Wait a bit before starting frontend
setTimeout(() => {
  console.log('\n🎨 Starting Frontend Server (http://localhost:5173)...');
  const frontendProcess = spawn(
    isWindows ? 'npm.cmd' : 'npm',
    ['run', 'dev'],
    {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: isWindows
    }
  );

  // Handle cleanup
  process.on('SIGINT', () => {
    console.log('\n\n⏹️  Shutting down servers...');
    backendProcess.kill();
    frontendProcess.kill();
    process.exit(0);
  });
}, 2000);

backendProcess.on('error', (err) => {
  console.error('Failed to start backend:', err);
  process.exit(1);
});
