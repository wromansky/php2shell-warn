# AGENTS.md

Single-file userscript: `php2shell-warn.user.js`. Four outcomes, and only these: affected version = red banner; confirmed PHP with hidden version = orange banner; patched version = nothing; no PHP signs = nothing. The silence is a hard requirement. Only add a PHP sign if it confirms PHP, never one that merely hints at it.

## Layout

- `php2shell-warn.user.js`: the script.
- `test/version.test.js`, `test/cases.js`: version table and shared PHP-sign cases. `cases.js` also drives the bookmarklet test.
- `docs/bookmarklet.txt`: manual `javascript:` fallback for browsers without extensions (mobile Chrome, Brave). Has its own copy of the `FIXED` map.
- `docs/install-humans.md`, `docs/install-mobile.md`, `docs/install-agents.md`: install guides.

## Rules

- Install or deploy the script: follow [docs/install-agents.md](docs/install-agents.md).
- Fixed versions and PHP-sign rules live in the script's detect block, duplicated in `php2shell-warn.user.js` and `docs/bookmarklet.txt`. If PHP ships new fixes, update both, add cases to both tests in `test/`, and update the version list in `README.md`.
- No dependencies, no build step. Keep it one file.
- Never show UI, log, or throw for a patched version or a site with no PHP signs.
- Run `node test/version.test.js`, `node test/bookmarklet.test.js` and `node --check php2shell-warn.user.js` before reporting done.
