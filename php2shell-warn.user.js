// ==UserScript==
// @name         PHP2Shell warning (CVE-2026-109618 / CVE-2026-109619)
// @namespace    https://github.com/wromansky/php2shell-warn
// @version      1.1.0
// @updateURL    https://raw.githubusercontent.com/wromansky/php2shell-warn/main/php2shell-warn.user.js
// @downloadURL  https://raw.githubusercontent.com/wromansky/php2shell-warn/main/php2shell-warn.user.js
// @description  Red banner: site reports an affected PHP version. Orange banner: site runs PHP but hides the version. Silent otherwise.
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// ==/UserScript==

(async () => {
  if (window.top !== window) return;

  // --- detect (tested by test/version.test.js) ---
  // Fixed: 8.2.35, 8.3.36, 8.4.27, 8.5.12. Everything older (incl. 5.x-8.1) is affected.
  const FIXED = { '8.2': 35, '8.3': 36, '8.4': 27, '8.5': 12 };
  const isVulnerable = (v) => {
    const [maj, min, patch] = v.split('.').map(Number);
    if (maj < 8 || (maj === 8 && min < 2)) return true;
    const fixed = FIXED[`${maj}.${min}`];
    return fixed !== undefined && patch < fixed; // simplified: unknown newer branches treated as fixed
  };

  const HEADERS = ['x-powered-by', 'server', 'x-pingback', 'link', 'x-generator', 'x-drupal-cache', 'x-drupal-dynamic-cache'];
  const CMS = /(wordpress|drupal|joomla|magento|prestashop|mediawiki|phpbb|vbulletin|typo3|moodle|opencart|woocommerce|shopware)/i;

  // h: lowercase response headers. Returns the PHP version if advertised, plus every sign that the site runs PHP.
  const classify = ({ h = {}, generator = '', assets = '', cookie = '', path = '' }) => {
    const powered = h['x-powered-by'] || '';
    const version = ((powered + ' ' + (h.server || '')).match(/PHP\/(\d+\.\d+\.\d+)/i) || [])[1];
    const ev = [];
    if (version) ev.push(`PHP/${version} header`);
    else if (/php/i.test(powered)) ev.push('X-Powered-By: PHP');
    if (h['x-pingback'] || /api\.w\.org/.test(h.link || '') || /\/wp-(content|includes)\//.test(assets)) ev.push('wordpress');
    if (h['x-drupal-cache'] || h['x-drupal-dynamic-cache'] || /drupal/i.test(h['x-generator'] || '')) ev.push('drupal');
    const cms = generator.match(CMS);
    if (cms) ev.push(cms[1].toLowerCase());
    if (/(^|;\s*)PHPSESSID=/.test(cookie)) ev.push('PHPSESSID cookie');
    if (/\.php(\/|$)/.test(path)) ev.push('.php URL');
    return { version, evidence: [...new Set(ev)] };
  };
  // --- end detect ---

  // Response headers are cached per site for a day; page signals are read fresh each time.
  const DAY = 864e5;
  let h = {};
  const cached = GM_getValue(location.origin);
  if (cached && Date.now() - cached.t < DAY) {
    h = cached.h;
  } else {
    try {
      const r = await fetch(location.href, { method: 'HEAD', credentials: 'omit', cache: 'no-store' });
      HEADERS.forEach((k) => { h[k] = r.headers.get(k) || ''; });
    } catch (e) { return; }
    GM_setValue(location.origin, { h, t: Date.now() });
  }

  let cookie = '';
  try { cookie = document.cookie; } catch (e) { /* sandboxed frame: skip */ }
  const { version, evidence } = classify({
    h,
    generator: (document.querySelector('meta[name=generator]') || {}).content || '',
    assets: [...document.querySelectorAll('script[src],link[href]')].map((e) => e.src || e.href).join(' '),
    cookie,
    path: location.pathname,
  });

  const banner = (color, text) => {
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'closed' });
    root.innerHTML = `<div style="position:fixed;top:0;left:0;right:0;z-index:2147483647;background:${color};color:#fff;
      font:14px/1.4 system-ui,sans-serif;padding:8px 12px;display:flex;gap:12px;align-items:center">
      <span style="flex:1">${text}</span><button style="cursor:pointer">Dismiss</button></div>`;
    root.querySelector('button').onclick = () => host.remove();
    document.documentElement.append(host);
  };

  // Affected version: red. PHP confirmed but version hidden: orange. Patched version or no PHP: nothing.
  if (version && isVulnerable(version)) {
    banner('#b00020', `⚠️ ${location.hostname} reports PHP ${version}: affected by php2shell RCE
      (CVE-2026-109618 / 109619). Fixed in 8.2.35, 8.3.36, 8.4.27, 8.5.12. Distro backports keep the old version number, so this may be a false positive. Avoid entering sensitive data.`);
  } else if (!version && evidence.length) {
    banner('#c2410c', `🟠 ${location.hostname} runs PHP (${evidence.join(', ')}) but hides the version, so it can't be confirmed patched for php2shell (CVE-2026-109618 / 109619).`);
  }
})();
