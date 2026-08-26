# Language learning workspaces

This repository contains three independent, adaptive language courses. Each course is a complete teaching workspace with its own mission, learner history, lessons, reference cards, and reusable browser components.

## Courses

- `courses/baha-german-b1-to-b2/` — practical German for Baha’s everyday life and work in Germany.
- `courses/akmaral-german-a1-to-b1/` — German for Akmaral’s study and work goals.
- `courses/asel-english-b1-to-b2/` — English for Asel’s family and social life.

The root `index.html` is the public course catalog. Every lesson is a self-contained HTML page with immediate feedback and a copyable learning report. Browser progress stays local to the learner’s device.

## Maintainer guides

- `TEACHING.md` — correction protocol and sources of truth for adaptive teaching.
- `PROJECT_STRUCTURE.md` — directory purposes, naming rules, and safe extension steps.
- `node scripts/validate-courses.mjs` — validates workspace structure, local links, element IDs, and fixed quiz answers.

Private `MISSION.md`, `NOTES.md`, `RESOURCES.md`, research, and learning records are intentionally excluded from the public repository.
