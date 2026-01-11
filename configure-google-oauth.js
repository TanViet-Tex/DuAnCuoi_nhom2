#!/usr/bin/env node

/**
 * Google OAuth Configuration Helper
 * 
 * Usage: node configure-google-oauth.js
 * 
 * This script helps configure Google OAuth 2.0 for the Watch Store project.
 * It guides you through obtaining a Google Client ID and updating configuration.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\n🔐 Google OAuth 2.0 Configuration Helper');
  console.log('=========================================\n');

  console.log('📝 Steps to get your Google Client ID:\n');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a new project or select existing');
  console.log('3. Search and enable "Google+ API"');
  console.log('4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID');
  console.log('5. Choose "Web application"');
  console.log('6. Add Authorized redirect URIs:');
  console.log('   - http://localhost:5173');
  console.log('   - http://localhost:5174');
  console.log('   - http://localhost:3000');
  console.log('   - (Your production domain)');
  console.log('7. Copy your Client ID (format: xxxxx.apps.googleusercontent.com)\n');

  const clientId = await question('✅ Enter your Google Client ID: ');

  if (!clientId || !clientId.includes('.apps.googleusercontent.com')) {
    console.log('\n❌ Invalid Client ID format. Expected: xxxxx.apps.googleusercontent.com');
    rl.close();
    process.exit(1);
  }

  // Update .env file
  const envPath = path.join(__dirname, '.env');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
    // Replace existing GOOGLE_CLIENT_ID
    envContent = envContent.replace(
      /VITE_GOOGLE_CLIENT_ID=.*/,
      `VITE_GOOGLE_CLIENT_ID=${clientId}`
    );
    envContent = envContent.replace(
      /GOOGLE_CLIENT_ID=.*/,
      `GOOGLE_CLIENT_ID=${clientId}`
    );
  } else {
    envContent = `# Backend API URL
VITE_API_URL=http://localhost:4000

# Google OAuth 2.0 Configuration
VITE_GOOGLE_CLIENT_ID=${clientId}
GOOGLE_CLIENT_ID=${clientId}

# JWT Secret
JWT_SECRET=watch-shop-secret-key-2025

# Server Port
PORT=4000
`;
  }

  fs.writeFileSync(envPath, envContent, 'utf-8');

  console.log('\n✅ Successfully updated .env file!');
  console.log(`\n📋 Configuration Summary:`);
  console.log(`   VITE_GOOGLE_CLIENT_ID: ${clientId}`);
  console.log(`   GOOGLE_CLIENT_ID: ${clientId}`);
  console.log(`   VITE_API_URL: http://localhost:4000`);
  console.log(`   PORT: 4000`);

  console.log('\n🚀 Next steps:');
  console.log('   1. Terminal 1: npm run server');
  console.log('   2. Terminal 2: npm run dev');
  console.log('   3. Go to http://localhost:5173 or http://localhost:5174');
  console.log('   4. Click "Sign in with Google" on login page\n');

  rl.close();
}

main().catch((err) => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});
