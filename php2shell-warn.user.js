// ==UserScript==
// @name         PHP2Shell warning (CVE-2026-109618 / CVE-2026-109619)
// @namespace    https://github.com/wromansky/php2shell-warn
// @version      1.0.0
// @updateURL    https://raw.githubusercontent.com/wromansky/php2shell-warn/main/php2shell-warn.user.js
// @downloadURL  https://raw.githubusercontent.com/wromansky/php2shell-warn/main/php2shell-warn.user.js
// @description  Warns when a site advertises a PHP version affected by php2shell. Silent otherwise.
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// ==/UserScript==

(async () => {
  if (window.top !== window) return;

  // Fixed: 8.2.35, 8.3.36, 8.4.27, 8.5.12. Everything older (incl. 5.x-8.1) is affected.
  const FIXED = { '8.2': 35, '8.3': 36, '8.4': 27, '8.5': 12 };
  const isVulnerable = (v) => {
    const [maj, min, patch] = v.split('.').map(Number);
    if (maj < 8 || (maj === 8 && min < 2)) return true;
    const fixed = FIXED[`${maj}.${min}`];
    return fixed !== undefined && patch < fixed; // simplified: unknown newer branches treated as fixed
  };

  // simplified: version comes from response headers only; hidden headers = no warning.
  const DAY = 864e5;
  const cached = GM_getValue(location.origin);
  let version;
  if (cached && Date.now() - cached.t < DAY) {
    version = cached.v;
  } else {
    try {
      const r = await fetch(location.href, { method: 'HEAD', credentials: 'omit', cache: 'no-store' });
      const hdr = `${r.headers.get('x-powered-by') || ''} ${r.headers.get('server') || ''}`;
      version = (hdr.match(/PHP\/(\d+\.\d+\.\d+)/i) || [])[1];
    } catch (e) { return; }
    GM_setValue(location.origin, { v: version, t: Date.now() });
  }
  if (!version || !isVulnerable(version)) return;

  const host = document.createElement('div');
  const root = host.attachShadow({ mode: 'closed' });
  root.innerHTML = `<div style="position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#b00020;color:#fff;
    font:14px/1.4 system-ui,sans-serif;padding:8px 12px;display:flex;gap:12px;align-items:center">
    <span style="flex:1">⚠️ ${location.hostname} reports PHP ${version}: affected by php2shell RCE
    (CVE-2026-109618 / 109619). Fixed in 8.2.35, 8.3.36, 8.4.27, 8.5.12. Distro backports keep the old version number, so this may be a false positive. Avoid entering sensitive data.</span>
    <button style="cursor:pointer">Dismiss</button></div>`;
  root.querySelector('button').onclick = () => host.remove();
  document.documentElement.append(host);
})();
