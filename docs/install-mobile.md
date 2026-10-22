# Mobile install guide

Mobile browsers differ a lot. Pick the row for your browser.

| Browser | Automatic warning | Fallback |
|---|---|---|
| Firefox (Android) | Yes, via Violentmonkey or Tampermonkey | n/a |
| Safari (iOS, iPadOS) | Yes, via the Userscripts app | Bookmarklet |
| Chrome (Android, iOS) | **No**: Chrome mobile has no extensions | Bookmarklet |
| Brave (Android, iOS) | **No**: Brave mobile has no extensions | Bookmarklet |
| Firefox (iOS) | **No**: iOS Firefox has no add-ons | Use Safari, or bookmarklet |
| Edge (Android, iOS) | Not tested | Bookmarklet |

If you want automatic warnings and you are on Chrome or Brave mobile, the only way is to switch to Firefox on Android or Safari on iOS for browsing. Nothing in this project can change that limit.

Script URL (for the automatic options):

```
https://raw.githubusercontent.com/wromansky/php2shell-warn/main/php2shell-warn.user.js
```

## Firefox on Android (automatic)

1. Install Firefox from Google Play.
2. Open the menu, then **Add-ons**, then install **Violentmonkey** (or Tampermonkey) from addons.mozilla.org.
3. In Firefox, open the script URL. Tap **Install** (Violentmonkey: **Confirm installation**).
4. To cover private tabs: Add-ons, tap the manager, enable **Run in private browsing**.

## Safari on iOS / iPadOS (automatic)

Uses the free, open-source [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) app. Not tested by the author, so use the verify step.

1. Install **Userscripts** from the App Store.
2. Open the Userscripts app and follow its setup: choose a folder where it stores scripts.
3. Enable the extension: **Settings, Apps, Safari, Extensions, Userscripts**, turn it on, and set **All Websites** to **Allow**.
4. In Safari, open the script URL. Tap the **aA** menu in the address bar, then **Userscripts**, and choose to install the script.
5. Tap **aA, Userscripts** on any page to confirm `PHP2Shell warning` is listed as active.

Tampermonkey for Safari (paid) also works if you already own it.

## Bookmarklet (Chrome, Brave, Edge, any mobile browser)

A bookmarklet is a bookmark that runs code when you open it. It is **manual**: it checks only the page you are on, and only when you run it. It always replies (warning, OK, or no version found), because you asked it to.

1. Open [`docs/bookmarklet.txt`](bookmarklet.txt) in the repo and copy the whole line (starts with `javascript:`).
2. Bookmark any page in your browser, then edit the bookmark: set the name to `PHP check` and replace the URL with the copied line.
   - **Chrome Android**: tap the star, then edit the bookmark from Bookmarks.
   - **Brave Android**: same as Chrome.
   - **Chrome iOS**: bookmark a page, then Bookmarks, Edit, and replace the URL.
   - **Brave iOS**: same as Chrome iOS.
3. To run it on a page: type `PHP check` in the address bar and tap the bookmark suggestion (not the search result). Chrome and Brave on Android run bookmarklets this way. Tapping the bookmark from the Bookmarks list may only open it as text on some versions.
4. A popup tells you the result.

Limits: it does not run on its own, it does not work on browser internal pages, and some sites with strict security headers may block the check. Chrome on iOS can refuse bookmarklet execution on some versions. If that happens, use Safari with the Userscripts app.

## Verify

- **Automatic options:** visit a site known to send `X-Powered-By: PHP/...` and temporarily set `const isVulnerable = () => true;` in the script editor. Expect the red banner. Revert after.
- **Bookmarklet:** run it on any site. You always get a popup, so a silent result means the bookmarklet did not run.

## Limits shared with desktop

Sites that hide the PHP version cannot be detected, and patched distro builds (such as Ubuntu 22.04 PHP 8.1) can show as false positives.
