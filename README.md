# php2shell-warn

A userscript that warns you when a website you visit advertises a PHP version affected by **php2shell** (CVE-2026-109618 and CVE-2026-109619, remote code execution in PHP core, disclosed 2026-10-21).

- Affected: every PHP version up to 8.1, plus 8.2.0-8.2.34, 8.3.0-8.3.35, 8.4.0-8.4.26, 8.5.0-8.5.11.
- Fixed in: **8.2.35, 8.3.36, 8.4.27, 8.5.12**.
- Affected site: a red, dismissible banner appears at the top of the page.
- Not affected, version hidden, or no PHP: nothing happens, no UI.

## How it works

On each page the script sends one `HEAD` request to the same URL and reads the `X-Powered-By` and `Server` response headers for `PHP/x.y.z`. Results are cached per site for 24 hours (in the userscript manager's storage, not the site's).

## Limits

- Sites that hide the PHP version (`expose_php=Off`, CDN header stripping) cannot be detected.
- Distro packages (for example Ubuntu 22.04 PHP 8.1) keep the old version number after backporting the fix, so a warning can be a false positive. The banner says so.
- Newer branches than 8.5 are treated as fixed.
- Chrome on Android and Safari are not covered (see the guide).

## Install

Pick your browser in [docs/install-humans.md](docs/install-humans.md). It covers Chrome, Edge, Brave, Opera, Vivaldi, Arc, other Chromium browsers, and Firefox (desktop and Android).

Script URL for one-click install in a userscript manager (after you have one installed):

```
https://raw.githubusercontent.com/wromansky/php2shell-warn/main/php2shell-warn.user.js
```

AI agents: see [AGENTS.md](AGENTS.md) and [docs/install-agents.md](docs/install-agents.md).

## Test

```
node test/version.test.js
```

## License

MIT
