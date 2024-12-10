/* eslint-disable no-undef */
import { execSync } from 'child_process';
import { existsSync, rmSync, renameSync } from 'fs';
import { platform } from 'os';

const isWindows = platform() === 'win32';

async function main() {
  try {
    // Set environment variable
    process.env.EXCLUDE_DEFINE = 'true';

    // Check if 7-Zip is installed on Windows
    if (isWindows) {
      try {
        execSync('7z i', { stdio: 'ignore' });
      } catch {
        console.log('7-Zip not found. Installing 7-Zip...');

        // Download and install 7-Zip
        execSync('curl -Lo 7z_installer.exe https://www.7-zip.org/a/7z2107-x64.exe');
        execSync('7z_installer.exe /S');

        // Add 7-Zip to PATH
        const sevenZipPath = 'C:\\Program Files\\7-Zip';
        const currentPath = process.env.PATH || '';
        process.env.PATH = `${currentPath};${sevenZipPath}`;

        // Clean up installer
        rmSync('7z_installer.exe');
      }
    }

    // Run TypeScript compilation
    console.log('Running TypeScript compilation...');
    execSync('tsc', { stdio: 'inherit' });

    // Run Vite build
    console.log('Building with Vite...');
    execSync('npx vite build', { stdio: 'inherit' });

    // Get timestamp for the filename
    const timestamp = Date.now();
    const baseZipPath = 'dist-current.zip';
    const newZipPath = `dist-old-${timestamp}.zip`;

    // Rename existing zip if it exists (Version management)
    if (existsSync(baseZipPath)) {
      console.log(`Renaming existing zip to ${newZipPath}`);
      renameSync(baseZipPath, newZipPath);
    }

    // Create zip file using appropriate command
    console.log('Creating zip file...');
    if (isWindows) {
      execSync(`7z a -tzip ${baseZipPath} ./dist/`, { stdio: 'inherit' });
    } else {
      // For Linux/Mac, use zip command
      execSync(`zip -r ${baseZipPath} dist/`, { stdio: 'inherit' });
    }

    console.log('Build and compression completed successfully.');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

main();
