// Extracts the detect block from the userscript and checks it.
const fs = require('fs');
const assert = require('assert');
const src = fs.readFileSync(__dirname + '/../php2shell-warn.user.js', 'utf8');
const body = src.split('// --- detect')[1].split('// --- end detect ---')[0].replace(/^[^\n]*\n/, '');
const { isVulnerable, classify } = new Function(`${body}; return { isVulnerable, classify };`)();

[
  ['5.6.40', true], ['7.4.33', true], ['8.0.30', true], ['8.1.34', true],
  ['8.2.34', true], ['8.2.35', false], ['8.3.35', true], ['8.3.36', false],
  ['8.4.26', true], ['8.4.27', false], ['8.5.11', true], ['8.5.12', false],
  ['8.6.0', false],
].forEach(([v, expected]) => assert.strictEqual(isVulnerable(v), expected, v));

// Shared with test/bookmarklet.test.js: [page signals, expected version, expected evidence]
const cases = require('./cases.js');
cases.forEach(({ name, page, version, evidence }) => {
  const r = classify(page);
  assert.strictEqual(r.version, version, `${name}: version`);
  assert.deepStrictEqual(r.evidence, evidence, `${name}: evidence`);
});
console.log('ok');
