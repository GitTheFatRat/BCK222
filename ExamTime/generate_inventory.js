const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const outputDir = path.join(rootDir, 'docs', 'full-audit');
const outputFile = path.join(outputDir, '00_FILE_INVENTORY.md');

// Directories and files to completely ignore
const ignoreList = [
  'node_modules',
  '.git',
  'uploads',
  '.DS_Store',
  'dist',
  'build'
];

// File extensions to ignore (binaries, media, etc)
const ignoreExtensions = [
  '.mp3', '.wav', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', 
  '.pdf', '.zip', '.tar', '.gz', '.woff', '.woff2', '.ttf', '.eot'
];

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function scanDir(dir, baseDir = '') {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    if (ignoreList.includes(file)) continue;
    
    const fullPath = path.join(dir, file);
    const relPath = path.join(baseDir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results.push({ type: 'dir', path: relPath, name: file });
      results = results.concat(scanDir(fullPath, relPath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (!ignoreExtensions.includes(ext)) {
        // Skip this script itself and the output dir
        if (file === 'generate_inventory.js' || relPath.startsWith('docs\\full-audit') || relPath.startsWith('docs/full-audit')) {
            continue;
        }
        results.push({ type: 'file', path: relPath, name: file });
      }
    }
  }
  return results;
}

function generateMarkdownTree(items) {
  let md = '# ExamTime File Inventory\n\n';
  md += 'This checklist tracks the exhaustive file-by-file documentation audit.\n\n';
  
  // Sort items: directories first, then files, alphabetically
  const dirs = items.filter(i => i.type === 'dir').sort((a,b) => a.path.localeCompare(b.path));
  const files = items.filter(i => i.type === 'file').sort((a,b) => a.path.localeCompare(b.path));
  
  // Group files by their parent directory to build a tree
  const tree = {};
  
  files.forEach(file => {
    // Normalise path separators for output
    const normPath = file.path.replace(/\\/g, '/');
    let parts = normPath.split('/');
    let filename = parts.pop();
    let dir = parts.join('/') || '/';
    
    if (!tree[dir]) tree[dir] = [];
    tree[dir].push(normPath);
  });
  
  // Build markdown
  const sortedDirs = Object.keys(tree).sort();
  for (const dir of sortedDirs) {
    if (dir === '/') {
       md += `## Root\n`;
    } else {
       md += `## ${dir}/\n`;
    }
    
    for (const filePath of tree[dir]) {
      md += `- [ ] \`${filePath}\`\n`;
    }
    md += '\n';
  }
  
  return md;
}

ensureDirSync(outputDir);
const items = scanDir(rootDir);
const markdown = generateMarkdownTree(items);
fs.writeFileSync(outputFile, markdown, 'utf8');

console.log(`Inventory generated at ${outputFile}`);
