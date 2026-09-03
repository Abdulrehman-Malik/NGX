# CLAUDE.md

This file gives any AI coding agent (Claude, or otherwise) full context on this
project by reading this single file. Keep it up to date as the project grows —
when you add features, change structure, or make decisions, update the
relevant section below in the same commit.

## Project Overview

- **Name:** NGX
- **Description:** NextAPP (placeholder description from README — update once
  the project's actual purpose is defined)
- **Status:** Early stage / scaffolding. No build system, framework, or
  backend has been set up yet.

## Current State

This repository currently contains:

- `README.md` — minimal project name/description, not yet expanded.
- `login.html` — a standalone, static login page (HTML/CSS/JS in one file,
  no external dependencies). It has:
  - Username/email + password fields with basic client-side validation
  - "Remember me" checkbox and "Forgot password?" / "Sign up" placeholder links
  - A `submit` event handler that currently only shows a demo `alert()` —
    it is **not** wired up to any real authentication backend yet. Look for
    the `TODO` comment inside the `<script>` tag in `login.html` for where to
    add the real API call.
- `CLAUDE.md` — this file.

There is no backend, database, routing, build tooling, package manifest, or
test suite in the repo yet.

## Tech Stack

- Currently: plain HTML/CSS/vanilla JS only.
- No framework, package manager, or backend has been chosen yet. If you add
  one (React, Next.js, Express, etc.), update this section with:
  - Language/runtime version
  - Framework(s) used
  - How to install dependencies
  - How to run locally
  - How to build/deploy

## How to Run

There is no build step. Open `login.html` directly in a browser, or serve the
directory with any static file server, e.g.:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/login.html
```

## Conventions / Decisions

_(None established yet. As decisions are made — folder structure, naming,
styling approach, auth strategy, API design, etc. — record them here so future
agents don't have to reverse-engineer them from code.)_

## Known Gaps / Next Steps

- Define what "NGX / NextAPP" actually is (target users, core features).
- Decide on and set up a backend/auth provider; connect `login.html`'s form
  submit to a real endpoint.
- Add a package manifest and build tooling if the project grows beyond static
  pages.
- Add tests once there's logic worth testing.

## Instructions for AI Agents Working on This Repo

1. Read this file first before making changes.
2. After any meaningful change (new feature, new file, new dependency,
   architectural decision), update the relevant section above so this file
   stays an accurate single source of truth.
3. Don't assume unstated requirements — if project intent is unclear, note
   the open question here instead of guessing silently.
