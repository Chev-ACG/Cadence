import { build } from 'esbuild';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

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

const appSrc = await readFile('index.html', 'utf8');
const inlineMatch = appSrc.match(/<script type="text\/babel" data-presets="env,react">([\s\S]*?)<\/script>/);
if (!inlineMatch) throw new Error('Could not find inline App script in index.html');
await writeFile('app.jsx', inlineMatch[1]);

const allEntries = [...jsxFiles, 'app.jsx'];

const result = await build({
  stdin: {
    contents: allEntries.map(f => `import ${JSON.stringify('./' + f)};`).join('\n'),
    resolveDir: '.',
    loader: 'js',
  },
  bundle: true,
  write: false,
  loader: { '.jsx': 'jsx' },
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  format: 'iife',
  minify: true,
  target: ['es2020'],
  external: ['react', 'react-dom'],
});

await rm('app.jsx');

const bundledJs = result.outputFiles[0].text;
const css = await readFile('styles.css', 'utf8');

const reactUmd = await (await fetch('https://unpkg.com/react@18.3.1/umd/react.production.min.js')).text();
const reactDomUmd = await (await fetch('https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js')).text();

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Cadence — Performance OS</title>
<style>
${css}
</style>
</head>
<body>
<div id="root"></div>
<script>${reactUmd}</script>
<script>${reactDomUmd}</script>
<script>${bundledJs}</script>
</body>
</html>
`;

await writeFile(join(DIST, 'index.html'), html);
console.log('Build complete →', join(DIST, 'index.html'), `(${(html.length / 1024).toFixed(1)} KB)`);
