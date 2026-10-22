# Install guide (humans)

Every browser needs a **userscript manager** extension first. Use [Violentmonkey](https://violentmonkey.github.io/) (open source) or [Tampermonkey](https://www.tampermonkey.net/). Then install the script.

Script URL:

```
https://raw.githubusercontent.com/wromansky/php2shell-warn/main/php2shell-warn.user.js
```

Opening that URL in a browser with a userscript manager installed shows an install prompt. Click **Install**.

## Chromium-based browsers

All of these use the Chrome Web Store, so the steps are the same.

| Browser | Get the extension from |
|---|---|
| Google Chrome | Chrome Web Store |
| Microsoft Edge | Edge Add-ons store, or Chrome Web Store (allow other stores when prompted) |
| Brave | Chrome Web Store |
| Opera / Opera GX | Opera add-ons, or install "Install Chrome Extensions" first, then Chrome Web Store |
| Vivaldi | Chrome Web Store |
| Arc | Chrome Web Store |
| Chromium, Ungoogled Chromium, others | Chrome Web Store (Ungoogled Chromium needs the "chromium-web-store" helper or a manual `.crx`) |

1. Install Violentmonkey or Tampermonkey from the store above.
2. **Enable user scripts** (required by current Chromium versions, Manifest V3):
   - Open `chrome://extensions` (Edge: `edge://extensions`, Brave: `brave://extensions`, Opera: `opera://extensions`, Vivaldi: `vivaldi://extensions`).
   - Click **Details** on the userscript manager.
   - Turn on **Allow User Scripts** (Chrome 138 and newer). On older Chromium versions, turn on **Developer mode** (top right) instead.
   - If the toggle is missing, update the browser.
3. Open the script URL above and click **Install**. Or open the manager's dashboard, choose **New script**, and paste the contents of `php2shell-warn.user.js`.
4. Check it: open the manager dashboard and confirm `PHP2Shell warning` is listed and enabled.

Notes:
- Brave Shields do not block the script. The script uses a plain same-site `HEAD` request.
- Incognito and private windows: open the extension's Details page and turn on **Allow in Incognito** (Edge: **Allow in InPrivate**) if you want coverage there.

## Firefox

1. Install Violentmonkey or Tampermonkey from [addons.mozilla.org](https://addons.mozilla.org).
2. Open the script URL above and click **Install** (or paste the file into a new script in the dashboard).
3. Private windows: open `about:addons`, click the manager, and set **Run in Private Windows** to Allow.
4. Firefox on Android works too: Firefox for Android supports add-ons from addons.mozilla.org. Install the manager the same way, then open the script URL.

Firefox forks (LibreWolf, Waterfox, Zen, Floorp) use the same addons.mozilla.org steps.

## Mobile

See [install-mobile.md](install-mobile.md).

## Verify it works

Open the manager dashboard, edit the script, and temporarily change the `isVulnerable` line to `const isVulnerable = () => true;`. Visit any site that sends `X-Powered-By: PHP/...`. The banner should show. Revert the edit afterwards.

## Update or remove

- Update: the script re-fetches from the URL when your manager checks for updates. Or re-open the script URL and click **Reinstall**.
- Remove: delete it from the manager dashboard.
