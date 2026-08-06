#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Support running compiled dist/index.js
const distPath = path.join(__dirname, '../dist/index.js');

if (!fs.existsSync(distPath)) {
  console.error('\x1b[31mError: CLI is not built. Please run "npm run build" inside the cli directory first.\x1b[0m');
  process.exit(1);
}

require(distPath);
