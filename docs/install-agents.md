# Install guide (agents)

Goal: get `php2shell-warn.user.js` running in the user's browser. The script is a userscript, so a userscript manager must exist first. Confirm the user wants it installed before touching their browser or profile.

Script source: `https://raw.githubusercontent.com/wromansky/php2shell-warn/main/php2shell-warn.user.js`

## Preconditions

1. Identify the browser: Chromium family (Chrome, Edge, Brave, Opera, Vivaldi, Arc, Chromium) or Firefox family (Firefox, LibreWolf, Waterfox, Zen, Floorp).
2. Check for an installed manager (Violentmonkey, Tampermonkey). If missing, the user must install it from the browser's extension store. Do not sideload extensions without asking.
3. Chromium Manifest V3 gate: the manager's **Allow User Scripts** toggle (Chrome 138+; older: **Developer mode**) at `<scheme>://extensions` must be on. Extensions cannot enable this themselves. It is a user action. If you cannot drive the browser, give the user the exact steps from `install-humans.md`.

## Path A: you can drive the browser (computer-use or browser automation)

1. Navigate to the script URL. The manager's install page opens.
2. Click **Install** / **Confirm installation**.
3. Open the manager dashboard and confirm `PHP2Shell warning` is enabled.

## Path B: no browser control

Give the user the script URL and the browser-specific steps from [install-humans.md](install-humans.md). Do not claim it is installed.

## Path C: managed or enterprise deployment

- Chromium: `ExtensionInstallForcelist` policy for the manager. Scripts still need to be added inside the manager.
- Firefox: `policies.json` `ExtensionSettings` to force-install the manager from addons.mozilla.org. Same caveat.

## Verify (do this, do not assume)

1. In the dashboard, edit the script and set `const isVulnerable = () => true;`.
2. Load a page whose response includes `X-Powered-By: PHP/<version>`. Check with `curl -sI <url> | grep -i -E 'x-powered-by|^server'`.
3. Expect a red banner. Then revert the edit.
4. Load a page with no PHP header. Expect no UI and no console errors.

## Do not

- Do not widen `@match` or `@grant`. The script needs only `GM_getValue` and `GM_setValue`.
- Do not add network calls to third parties. The only request is a same-URL `HEAD`.
- Do not mark the install complete until the dashboard shows the script enabled.
