// Extracts the FIXED map and isVulnerable from the userscript and checks them.
const fs = require('fs');
const assert = require('assert');
const src = fs.readFileSync(__dirname + '/../php2shell-warn.user.js', 'utf8');
const body = src.match(/const FIXED[\s\S]*?\n  };\n/)[0];
const isVulnerable = new Function(`${body}; return isVulnerable;`)();

[
  ['5.6.40', true], ['7.4.33', true], ['8.0.30', true], ['8.1.34', true],
  ['8.2.34', true], ['8.2.35', false], ['8.3.35', true], ['8.3.36', false],
  ['8.4.26', true], ['8.4.27', false], ['8.5.11', true], ['8.5.12', false],
  ['8.6.0', false],
].forEach(([v, expected]) => assert.strictEqual(isVulnerable(v), expected, v));
console.log('ok');
