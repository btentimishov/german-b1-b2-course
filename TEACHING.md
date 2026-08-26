# Teaching protocol

Each directory under `courses/` is one `$teach` workspace and one learner mission. Select the learner first; teaching state never crosses course boundaries.

## Before teaching or correcting

1. Read the course’s `MISSION.md`, `NOTES.md`, `RESOURCES.md`, and relevant `learning-records/`.
2. Preserve the learner’s exact wording and the surrounding sentences.
3. Ground grammar claims in a source already curated in `RESOURCES.md`; add a high-trust source when the topic is new.

The step is complete when the intended meaning, current learning floor, and source for every correction are explicit.

## Semantic audit for connected text

For every disputed pronoun or omitted element:

1. Identify its intended antecedent from the learner’s adjacent sentences.
2. Label the antecedent’s gender and the pronoun’s sentence role: subject/Nominativ, recipient/Dativ, or object/Akkusativ.
3. Identify the subject of every finite verb. German finite clauses normally require an expressed or recoverable subject.
4. Separate grammatical form from natural phrasing. A form may be grammatically possible while the chosen verb–noun combination is unusual.
5. If more than one antecedent is plausible, show each reading and its form. Preserve the learner’s stated reading once clarified.

The audit is complete only when each pronoun has an antecedent and each finite verb has a subject. A correction must not silently replace the learner’s intended referent.

## Sources of truth

- Fixed quiz answers live once, in the lesson’s `data-answer` attributes. The validator checks that every answer is one of the visible options.
- Add `data-semantic-audit` to a revised lesson’s fixed-answer section. Every answer in that file must then carry `data-prompt` and `data-explanation`; validation fails when either audit field is missing.
- Free production has no single answer key. The learner’s demonstrated understanding, intended meaning, and human correction live in a numbered `learning-records/*.md` file.
- Teaching preferences and recurring review rules live in `NOTES.md`.
- Grammar sources and their intended use live in `RESOURCES.md`.

Automated writing scores are provisional pattern checks. Human semantic review overrides them and the discrepancy is recorded.

## After reviewing learner work

1. State what is correct before naming the smallest necessary repair.
2. Record non-trivial demonstrated knowledge or a corrected interpretation in the next learning record.
3. Update `NOTES.md` only for durable preferences or future-teaching constraints.
4. Design the next lesson from the learning record, with one tightly scoped win and immediate feedback.
5. Run `node scripts/validate-courses.mjs` and syntax-check modified JavaScript.

The review is complete when the chat correction, learning record, next lesson, and automated checks agree.
