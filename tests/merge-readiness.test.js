const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const files = ['README.md', 'index.html', 'app.js', 'forecaster.js', 'styles.css', 'tests/forecaster.test.js'];

for (const file of files) {
  const path = join(root, file);
  assert.ok(existsSync(path), `${file} should exist after merge`);
  const content = readFileSync(path, 'utf8');
  assert.doesNotMatch(content, /<<<<<<<|=======|>>>>>>>/, `${file} should not contain merge conflict markers`);
}

const html = readFileSync(join(root, 'index.html'), 'utf8');
for (const asset of ['styles.css', 'forecaster.js', 'app.js']) {
  assert.match(html, new RegExp(asset.replace('.', '\\.')), `index.html should reference ${asset}`);
  assert.ok(existsSync(join(root, asset)), `${asset} should be present for the static app`);
}

assert.match(readFileSync(join(root, 'app.js'), 'utf8'), /MiniMeForecaster\.predictWeek/, 'app.js should wire the UI to the forecaster');
assert.match(readFileSync(join(root, 'forecaster.js'), 'utf8'), /runAgents/, 'forecaster.js should include the agent council export');

console.log('Merge readiness checks passed');
