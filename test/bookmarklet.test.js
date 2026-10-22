// Runs the shipped bookmarklet with a mocked fetch/location/alert.
const fs = require('fs');
const assert = require('assert');
const code = fs.readFileSync(__dirname + '/../docs/bookmarklet.txt', 'utf8').trim().replace(/^javascript:/, '');

const run = async (headers, fail) => {
  let msg;
  const fetch = async () => { if (fail) throw new Error('boom'); return { headers: { get: (k) => headers[k] || null } }; };
  await new Function('fetch', 'location', 'alert', `return ${code}`)(fetch, { href: 'https://x.test/', hostname: 'x.test' }, (m) => { msg = m; });
  await new Promise((r) => setImmediate(r));
  return msg;
};

(async () => {
  assert.match(await run({ 'x-powered-by': 'PHP/8.3.35' }), /^WARNING/);
  assert.match(await run({ server: 'Apache PHP/7.4.33' }), /^WARNING/);
  assert.match(await run({ 'x-powered-by': 'PHP/8.3.36' }), /^OK/);
  assert.match(await run({}), /^No PHP version/);
  assert.match(await run({}, true), /^Could not check/);
  console.log('ok');
})();
