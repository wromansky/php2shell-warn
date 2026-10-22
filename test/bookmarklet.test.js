// Runs the shipped bookmarklet with mocked fetch/location/document/alert, on the same cases as the userscript.
const fs = require('fs');
const assert = require('assert');
const cases = require('./cases.js');
const code = fs.readFileSync(__dirname + '/../docs/bookmarklet.txt', 'utf8').trim().replace(/^javascript:/, '');

const run = async ({ h = {}, generator = '', assets = '', cookie = '', path = '/' }, fail) => {
  let msg;
  const fetch = async () => { if (fail) throw new Error('boom'); return { headers: { get: (k) => h[k] || null } }; };
  const document = {
    cookie,
    querySelector: () => (generator ? { content: generator } : null),
    querySelectorAll: () => (assets ? [{ src: assets }] : []),
  };
  await new Function('fetch', 'location', 'document', 'alert', `return ${code}`)(
    fetch, { href: 'https://x.test/', hostname: 'x.test', pathname: path }, document, (m) => { msg = m; });
  await new Promise((r) => setImmediate(r));
  return msg;
};

(async () => {
  for (const { name, page, version, evidence } of cases) {
    const msg = await run(page);
    if (version) assert.match(msg, /^(WARNING|OK): x\.test reports PHP /, name);
    else if (evidence.length) assert.match(msg, /^ORANGE: x\.test runs PHP/, name);
    else assert.match(msg, /^No PHP signs/, name);
    if (version) assert.strictEqual(/^WARNING/.test(msg), ['7.4.33', '8.3.35'].includes(version), name);
    if (!version) evidence.forEach((e) => assert.ok(msg.includes(e), `${name}: missing ${e} in ${msg}`));
  }
  assert.match(await run({ h: { 'x-powered-by': 'PHP/8.3.36' } }), /^OK/);
  assert.match(await run({}, true), /^Could not check/);
  console.log('ok');
})();
