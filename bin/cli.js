#!/usr/bin/env node

import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const distDir = join(projectRoot, 'docs');

console.log('🚀 Starting Aeternum Research Tool...\n');

// Check if dist directory exists, if not, build the project
if (!existsSync(distDir)) {
  console.log('📦 Building project...');
  try {
    execSync('npm run build', {
      cwd: projectRoot,
      stdio: 'inherit'
    });
    console.log('✅ Build completed!\n');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('📦 Using existing build...\n');
}

// Create HTTP server to serve the built files
const server = createServer(async (req, res) => {
  try {
    let filePath = join(distDir, req.url === '/' ? 'index.html' : req.url);

    // Handle SPA routing - serve index.html for all non-file requests
    if (!existsSync(filePath) || !filePath.startsWith(distDir)) {
      filePath = join(distDir, 'index.html');
    }

    const content = await readFile(filePath);
    const ext = filePath.split('.').pop();

    // Set appropriate content types
    const contentTypes = {
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon'
    };

    res.writeHead(200, {
      'Content-Type': contentTypes[ext] || 'text/plain',
      'Cache-Control': 'no-cache'
    });
    res.end(content);
  } catch (error) {
    res.writeHead(404);
    res.end('File not found');
  }
});

const PORT = 3000;

// Start server
server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('🌐 Server running at:', url);
  console.log('📖 Aeternum Research Tool is ready!\n');

  // Open browser
  const { platform } = process;
  let openCommand;

  if (platform === 'darwin') {
    openCommand = 'open';
  } else if (platform === 'win32') {
    openCommand = 'start';
  } else {
    openCommand = 'xdg-open';
  }

  try {
    execSync(`${openCommand} ${url}`, { stdio: 'ignore' });
    console.log('🌍 Browser opened automatically');
  } catch (error) {
    console.log('ℹ️  Please open your browser and navigate to:', url);
  }

  console.log('\n💡 Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Aeternum Research Tool...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down Aeternum Research Tool...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
