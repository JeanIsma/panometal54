const fs = require('fs');
const path = require('path');

const root = __dirname;
const src = path.join(root, 'src');
const pub = path.join(root, 'public');
const dist = path.join(root, 'dist');
const docs = path.join(root, 'docs');

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function removeDir(dir) { fs.rmSync(dir, { recursive: true, force: true }); }
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
function writeUtf8(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, 'utf8');
}
function patchForStaticHosting(content) {
  return content.replaceAll('"/images/', '"./images/').replaceAll("'/images/", "'./images/");
}

removeDir(dist);
removeDir(docs);
ensureDir(dist);
ensureDir(docs);

copyFile(path.join(src, 'styles.css'), path.join(dist, 'styles.css'));
copyFile(path.join(src, 'styles.css'), path.join(docs, 'styles.css'));
copyFile(path.join(src, 'config.js'), path.join(dist, 'config.js'));
writeUtf8(path.join(docs, 'config.js'), patchForStaticHosting(fs.readFileSync(path.join(src, 'config.js'), 'utf8')));
copyFile(path.join(src, 'scene.js'), path.join(dist, 'scene.js'));
copyFile(path.join(src, 'scene.js'), path.join(docs, 'scene.js'));

let main = fs.readFileSync(path.join(src, 'main.js'), 'utf8');
main = main.replace('import "./styles.css";\n', '');
writeUtf8(path.join(dist, 'main.js'), main);
writeUtf8(path.join(docs, 'main.js'), patchForStaticHosting(main));

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace('</head>', '    <link rel="stylesheet" href="./styles.css" />\n  </head>');
html = html.replace('<script type="module" src="/src/main.js"></script>', '<script type="module" src="./main.js"></script>');
writeUtf8(path.join(dist, 'index.html'), html);
writeUtf8(path.join(docs, 'index.html'), html);

copyDir(path.join(pub, 'images'), path.join(dist, 'images'));
copyDir(path.join(pub, 'images'), path.join(docs, 'images'));
for (const file of ['robots.txt', 'sitemap.xml']) {
  const from = path.join(pub, file);
  if (fs.existsSync(from)) {
    copyFile(from, path.join(dist, file));
    copyFile(from, path.join(docs, file));
  }
}
writeUtf8(path.join(docs, '.nojekyll'), '');
writeUtf8(path.join(dist, 'README-UPLOAD.txt'), 'Upload the contents of this folder to your hosting root.');
writeUtf8(path.join(docs, 'README-UPLOAD.txt'), 'GitHub Pages uses this docs folder.');
console.log('Website built successfully in dist and docs folders.');
