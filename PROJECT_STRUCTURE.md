# Project folder structure

The repository is a small static-site catalog containing three independent teaching workspaces. The learner is the organizing unit.

```text
.
├── index.html                    # public course catalog
├── 404.html                      # redirects historical course URLs
├── site-assets/                  # catalog-only styles
├── scripts/                      # repository-wide validation
├── courses/
│   └── <learner>-<language>-<level>/
│       ├── MISSION.md            # private goal and constraints
│       ├── NOTES.md              # private durable teaching preferences
│       ├── RESOURCES.md          # private curated knowledge sources
│       ├── learning-records/     # private evidence of demonstrated learning
│       ├── index.html            # public course entry point
│       ├── assets/               # public reusable course components
│       ├── lessons/              # public interactive lessons
│       ├── reference/            # public printable reference cards
│       └── research/             # optional private source synthesis
└── docs/agents/                  # repository agent infrastructure
```

## Naming rules

- Course folders use `<learner>-<language>-<start>-to-<target>` in lowercase dash-case.
- Lessons and references use a four-digit sequence followed by a dash-case title.
- Learning records use an independent four-digit sequence and describe demonstrated knowledge, not activity.
- Assets stay inside the course that owns them. Promote an asset only after two courses genuinely share the same behavior.

## Adding a lesson

1. Select one course and read its private teaching state according to `TEACHING.md`.
2. Add the next numbered lesson and, when useful, a matching reference card.
3. Reuse the course’s existing assets; place reusable interaction code there.
4. Add the lesson to that course’s navigation and progress list.
5. Run `node scripts/validate-courses.mjs` and syntax-check changed JavaScript.

## Moving public files

Preserve Git history with `git mv`. Keep a redirect in the root `404.html` when a published path changes. A structural change is complete only when internal links validate and every course still opens from the root catalog.
