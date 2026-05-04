import { build } from 'esbuild';
import { mkdir, copyFile, readFile, writeFile, rm, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const DIST = 'dist';
await rm(DIST, { recursive: true, force: true });
await mkdir(join(DIST, 'screens'), { recursive: true });

const jsxFiles = [
  'tweaks-panel.jsx',
  'data.jsx',
  'icons.jsx',
  'charts.jsx',
  'shell.jsx',
  'cmdk.jsx',
  'screens/dashboard.jsx',
  'screens/preflight.jsx',
  'screens/registry.jsx',
  'screens/entry.jsx',
  'screens/reports.jsx',
  'screens/clients.jsx',
];

await build({
  entryPoints: jsxFiles,
  outdir: DIST,
  outbase: '.',
  outExtension: { '.js': '.js' },
  loader: { '.jsx': 'jsx' },
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  bundle: false,
  minify: true,
  target: ['es2020'],
  logLevel: 'info',
});

await copyFile('styles.css', join(DIST, 'styles.css'));

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Cadence — Performance OS</title>
<link rel="stylesheet" href="styles.css"/>
</head>
<body>
<div id="root"></div>

<script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>

<script src="tweaks-panel.js"></script>
<script src="data.js"></script>
<script src="icons.js"></script>
<script src="charts.js"></script>
<script src="shell.js"></script>
<script src="cmdk.js"></script>
<script src="screens/dashboard.js"></script>
<script src="screens/preflight.js"></script>
<script src="screens/registry.js"></script>
<script src="screens/entry.js"></script>
<script src="screens/reports.js"></script>
<script src="screens/clients.js"></script>
<script src="app.js"></script>
</body>
</html>
`;
await writeFile(join(DIST, 'index.html'), html);

const appSrc = await readFile('index.html', 'utf8');
const inlineMatch = appSrc.match(/<script type="text\/babel" data-presets="env,react">([\s\S]*?)<\/script>/);
if (!inlineMatch) throw new Error('Could not find inline App script in index.html');
await writeFile('app.jsx', inlineMatch[1]);
await build({
  entryPoints: ['app.jsx'],
  outfile: join(DIST, 'app.js'),
  loader: { '.jsx': 'jsx' },
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  bundle: false,
  minify: true,
  target: ['es2020'],
});
await rm('app.jsx');

console.log('Build complete →', DIST);
