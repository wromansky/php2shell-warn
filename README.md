# php2shell-warn

A userscript that warns you when a website you visit advertises a PHP version affected by **php2shell** (CVE-2026-109618 and CVE-2026-109619, remote code execution in PHP core, disclosed 2026-10-21).

- Affected: every PHP version up to 8.1, plus 8.2.0-8.2.34, 8.3.0-8.3.35, 8.4.0-8.4.26, 8.5.0-8.5.11.
- Fixed in: **8.2.35, 8.3.36, 8.4.27, 8.5.12**.
| What the site shows | What you see |
|---|---|
| Advertises an **affected** PHP version | **Red** banner |
| Confirmed PHP, but version hidden | **Orange** banner (cannot confirm it is patched) |
| Advertises a **patched** PHP version | Nothing |
| No sign of PHP | Nothing |

"Confirmed PHP" means at least one of: a `PHP` `X-Powered-By` header, WordPress or Drupal response headers, a CMS `generator` meta tag (WordPress, Drupal, Joomla, MediaWiki, Magento and similar PHP apps), `wp-content` or `wp-includes` assets, a `PHPSESSID` cookie, or a `.php` page URL.

## How it works

On each page the script sends one `HEAD` request to the same URL and reads a few response headers (`X-Powered-By`, `Server`, `Link`, `X-Pingback`, `X-Generator`, Drupal cache headers). It also checks the page itself for the other signs above. Results are cached per site for 24 hours (in the userscript manager's storage, not the site's).

## Limits

- Sites that run PHP without any of the signs above (custom apps behind a CDN, for example drupal.org, php.net and phpmyadmin.net sent none) stay silent. Hidden PHP cannot be detected from the browser.
- A static export of a WordPress site can show `wp-content` assets without running PHP, giving an orange banner.
- Distro packages (for example Ubuntu 22.04 PHP 8.1) keep the old version number after backporting the fix, so a warning can be a false positive. The banner says so.
- Newer branches than 8.5 are treated as fixed.
- Chrome and Brave on mobile have no extension support, so they get a manual bookmarklet instead of automatic warnings.

## Install

- Desktop: [docs/install-humans.md](docs/install-humans.md) covers Chrome, Edge, Brave, Opera, Vivaldi, Arc, other Chromium browsers, and Firefox.
- Mobile: [docs/install-mobile.md](docs/install-mobile.md) covers Firefox on Android and Safari on iOS (automatic), plus a bookmarklet for Chrome, Brave and others (manual).

Script URL for one-click install in a userscript manager (after you have one installed):

```
https://raw.githubusercontent.com/wromansky/php2shell-warn/main/php2shell-warn.user.js
```

AI agents: see [AGENTS.md](AGENTS.md) and [docs/install-agents.md](docs/install-agents.md).

## Test

```
node test/version.test.js
node test/bookmarklet.test.js
```

## License

MIT
