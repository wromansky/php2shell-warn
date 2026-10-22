# AGENTS.md

Single-file userscript: `php2shell-warn.user.js`. Warns on sites advertising PHP versions affected by CVE-2026-109618 / CVE-2026-109619. Silent when nothing is detected. That silence is a hard requirement.

## Layout

- `php2shell-warn.user.js`: the script.
- `test/version.test.js`: checks the version table.
- `docs/install-humans.md`, `docs/install-agents.md`: browser install guides.

## Rules

- Install or deploy the script: follow [docs/install-agents.md](docs/install-agents.md).
- Fixed versions live in the `FIXED` map in the script. If PHP ships new fixes, update the map, add cases to `test/version.test.js`, and update the version list in `README.md`.
- No dependencies, no build step. Keep it one file.
- Never show UI, log, or throw when no affected version is detected.
- Run `node test/version.test.js` and `node --check php2shell-warn.user.js` before reporting done.
