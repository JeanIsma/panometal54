const fs = require('fs');
const path = require('path');

const root = __dirname;
const src = path.join(root, 'src');
const pub = path.join(root, 'public');
const dist = path.join(root, 'dist');

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function copyFile(from, to) { ensureDir(path.dirname(to)); fs.copyFileSync(from, to); }
function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  ensureDir(to);
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(source, target);
    else copyFile(source, target);
  }
}

ensureDir(dist);
copyFile(path.join(src, 'config.js'), path.join(dist, 'config.js'));
copyFile(path.join(src, 'scene.js'), path.join(dist, 'scene.js'));
copyFile(path.join(src, 'styles.css'), path.join(dist, 'styles.css'));

let main = fs.readFileSync(path.join(src, 'main.js'), 'utf8');
main = main.replace('import "./styles.css";\n', '');
fs.writeFileSync(path.join(dist, 'main.js'), main, 'utf8');

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace('</head>', '    <link rel="stylesheet" href="./styles.css" />\n  </head>');
html = html.replace('<script type="module" src="/src/main.js"></script>', '<script type="module" src="./main.js"></script>');
fs.writeFileSync(path.join(dist, 'index.html'), html, 'utf8');

copyDir(path.join(pub, 'images'), path.join(dist, 'images'));
for (const file of ['robots.txt', 'sitemap.xml']) {
  const from = path.join(pub, file);
  if (fs.existsSync(from)) copyFile(from, path.join(dist, file));
}

console.log('Website built successfully in the dist folder.');
