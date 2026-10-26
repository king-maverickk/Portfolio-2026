# DeliverySheets

The two-sheet overlay for the "How I’ll deliver for you" section. A left sheet holds the role list and scenario sentence. A right sheet holds an interactive resume, three reference rows, and three cards. Everything the sheets show comes from a **dataset** file, so the same component can serve every annotation.

Today only `(hiring manager)` has a dataset. `(freelance/contract)` and `(open to work)` still open the original single sheet.

## Files

```
HowIllDeliver/
├── index.js                          Opens a sheet when an annotation is clicked
├── index.module.scss                 Unchanged
├── index.test.js                     Your 5 original tests + 6 for the two-sheet layout
└── DeliverySheets/
    ├── index.js                      The component (layout, state, interactions)
    ├── index.module.scss             All styling for the two sheets
    ├── README.md                     This file
    └── datasets/
        └── hiringManagers.js         The content: roles, scenarios, resume, skills, rows
```

## How it fits together

1. `HowIllDeliver/index.js` has a map: `SHEET_DATASETS = { 'hiring-manager': hiringManagers }`.
2. When an annotation is clicked, the parent looks up its id in that map.
3. **Found:** it renders `<DeliverySheets dataset={...} />`. **Not found:** it renders the original single sheet from `SHEET_CONTENT`.
4. The sheet’s **title and description** still come from `SHEET_CONTENT` in the parent, not from the dataset.
5. The accent color still comes from the annotation’s `--annotation-border-color` (`#3794FE` for hiring manager).

Closing the sheets unmounts the component, so the selected role, scenario and hover state reset every time it opens. The first role and first scenario are always the defaults.

## The dataset

`datasets/hiringManagers.js` ends with one default export. These are the keys the component reads:

| Key | Type | What it controls |
| --- | --- | --- |
| `fileName` | string | The label at the top of the right sheet ("File: Resume") |
| `roles` | array | The role list on the left and the small switcher on the right |
| `scenarios` | array | The chips and the large sentence on the left |
| `skills` | array | The three cards, and the "Skills and tools" section of the resume |
| `cardGroups` | array | Splits `skills` into the three cards and the resume’s skill lines |
| `resume` | object | Everything printed on the white resume page |
| `rows` | array | The Experience / Education / Portfolio rows under the resume |
| `id` | string | Informational only. The component never reads it. The key in `SHEET_DATASETS` is what matters. |

### `roles`

```js
{ id: 'motion', label: 'Motion Design', short: 'Motion' }
```

- `id` is the tag used everywhere else (see "Tagging" below).
- `label` shows in the left list. `short` shows in the resume switcher.
- The **first role is the default** when the sheets open.

### `scenarios`

```js
{ id: 'marketing-team', label: 'Marketing team', sentence: 'With a marketing team, I turn ...' }
```

- `label` is the chip. `sentence` is the large text.
- The **first scenario is the default**.
- Scenarios do not change the role. They only swap the sentence.

### `skills` and `cardGroups`

```js
// skills: one flat list
{ text: 'Figma', kind: 'tool', roles: ['interactions', 'ui'] }

// cardGroups: how that list is split up
{ kind: 'tool', title: 'Tools', resumeTitle: 'Tools' }
```

- `kind` on a skill must match a `kind` in `cardGroups`. A skill with an unmatched kind appears nowhere.
- Each card shows only the skills tagged with the **selected role**. A role with no skills of some kind gets an empty card.
- The resume’s "Skills and tools" section lists **every** skill, with the selected role’s items bold and underlined.
- `title` is the card heading. `resumeTitle` is the label on that line in the resume.

### `resume`

| Key | Shape |
| --- | --- |
| `name`, `title` | strings |
| `contact` | array of strings, shown in a row |
| `summary` | a **parts array** (see below) |
| `experience` | array of `{ id, heading, meta, bullets }`, where `bullets` is an array of parts arrays |
| `projects` | `{ id, bullets }` (one entry, no heading) |
| `education` | `{ id, heading, detail }` |

**Parts arrays** are how text gets highlighted. A parts array mixes plain strings with tagged phrases:

```js
[
  'Designed and built websites end to end, from ',
  mark('wireframes and user flows', 'interactions'),
  ' to ',
  mark('polished layouts in Figma', 'ui'),
  '.'
]
```

`mark(text, ...roles)` is a small helper at the top of the dataset file. It returns `{ text, roles }`. When a listed role is selected, that phrase turns bold with an underline. Plain strings never change.

### `rows`

```js
{ label: 'Experience', items: [{ id: 'freelance', label: 'Freelance designer-developer' }] }
```

Each item’s `id` links it to a resume entry (see below).

## Tagging and ids

Three kinds of ids have to agree with each other. Nothing checks this for you yet, so a typo fails quietly.

| Link | Must match | If it doesn’t |
| --- | --- | --- |
| Role tags in `mark(...)` and `skills[].roles` | an `id` in `roles` | That phrase or skill never highlights, and never appears in a card |
| `rows[].items[].id` | an entry id: `experience[].id`, `projects.id` or `education.id` | Hovering does nothing and clicking doesn’t scroll |
| `skills[].kind` | a `kind` in `cardGroups` | The skill is not shown |

Rows and entries are linked both ways. Hovering or focusing a row lights up its resume entry. Hovering a resume entry lights up its row. Clicking a row scrolls the resume to that entry. A resume entry with no row still renders fine. It just has nothing to link to.

## What you can and can’t change

### Safe to change freely

- All copy: names, headings, bullets, sentences, labels, contact lines, dates.
- How many items there are. Any number of scenarios (chips wrap), skills, experience entries, bullets, or row items.
- Which roles a phrase or skill is tagged with.
- Adding or removing a role, as long as you update every tag that mentions it.
- Colors, sizes and widths in `index.module.scss` (see "Styling" below).

### Change with care

- **Ids must be unique** within their list, because they are used as React keys: role ids, scenario ids, row labels, row item ids, `cardGroups` kinds, `contact` strings, and `skills[].text`.
- **Keep every required field.** The component expects `resume.projects`, `resume.education`, at least one role, and at least one scenario. Removing one throws an error instead of rendering an empty section.
- **Renaming a role id** means updating every `mark(...)` and `skills[].roles` that uses it.
- **Changing copy can break tests.** The new tests look for specific text (see the last section). Update the test when you change that text.
- **Bold text reflows.** Switching roles changes font weight, so lines may re-wrap slightly. This is expected, not a bug.

### Don’t change unless you also change the parent

- The ids `delivery-sheet`, `delivery-sheet-title` and `delivery-sheet-description`, and the `data-sheet-dialog` attribute on the root element. The parent’s focus trap and `aria-controls` depend on them.
- The `closeButtonRef` wiring. The close button must receive it, because the parent uses it for initial focus.
- Exactly one `role="dialog"` in the tree. The existing tests rely on it.
- The root `.dialog` rule `pointer-events: none` with `.sheet` set to `auto`. That is what lets a click in the gap between the sheets reach the backdrop and close both.
- The `sheetBackdrop` class in the parent. The click-to-close handler and the tests find it by that name.
- The field names the component reads (`roles`, `scenarios`, `skills`, `cardGroups`, `resume`, `rows`, `fileName`). Renaming them means editing `DeliverySheets/index.js`.

## Adding a dataset for another annotation

1. Copy `datasets/hiringManagers.js` to `datasets/freelance.js` (or `openToWork.js`).
2. Rewrite the content. Keep the same keys.
3. In `HowIllDeliver/index.js`, import it and add one line to the map:
   ```js
   const SHEET_DATASETS = {
     'hiring-manager': hiringManagers,
     freelance: freelance
   };
   ```
   The map key is the annotation id from `ANNOTATIONS` (`open-to-work`, `freelance`, `hiring-manager`).
4. Set its `title` and `description` in `SHEET_CONTENT` as before.

Once an annotation has a dataset, its old `paragraphs` in `SHEET_CONTENT` are no longer shown. The hiring-manager `paragraphs` are already unused.

The layout is still shaped like a resume. If a dataset needs a different structure, the right-hand panel in `DeliverySheets/index.js` is the part to make swappable.

## Styling

All tokens sit at the top of `.dialog` in `index.module.scss`.

| Token | Value | Used for |
| --- | --- | --- |
| `--sheet-bg` | `#2b2b2b` | Sheet background |
| `--sheet-text` | `#f7f7f7` | Text on the sheets |
| `--sheet-muted` | `#a3a3a3` | Secondary text |
| `--sheet-surface` | `#353535` | Cards |
| `--stage-bg` | `#232323` | The dark area behind the resume page |
| `--sheet-accent` | the annotation color, fallback `#3794fe` | Sheet side borders, underlines on the dark sheets |
| `--paper-accent` | `#2864e8` | Underlines and entry tint on the resume page |

Other things to know:

- **Widths:** left `clamp(22rem, 30vw, 32.5rem)`, right `clamp(32rem, 46vw, 54rem)`. The resume area height is `clamp(18rem, 52vh, 36rem)`.
- **Highlight style:** bold plus underline, everywhere. The `underline-cue` mixin and the `*Active` classes (`roleActive`, `chipActive`, `rowItemActive`, `switchItemActive`, `markOn`) all follow it.
- **Going light:** change the tokens above (plus `--sheet-border`), then look for the few hard-coded colors: the white focus outlines, the close button’s hover background, `#d4d4d4` on `.cardList`, and the dark box-shadows on `.left` and `.right`.
- **Scenario sentence:** the wrapper reserves five lines so the chips don’t jump when the text changes. If your sentences get longer, raise `5` in `.sentenceWrap`.
- **Below 900px wide:** the sheets stack into one scrolling column. This is a stopgap, not a mobile design.
- **Motion:** the slide-in and fades are switched off under `prefers-reduced-motion`. Row clicks scroll instantly in that mode.

## Known limits

- **Not yet checked in a browser.** The behavior is covered by tests and the SCSS compiles, but the sizing and spacing haven’t been seen on screen.
- **Highlights are visual only.** Screen readers aren’t told which phrases are highlighted. The marks carry `data-highlighted` if you want to build on that.
- **No dataset validation.** A mistyped role id or entry id is silently ignored. A small dev-only check that warns about unmatched ids would be easy to add.
- **Everything in `hiringManagers.js` is placeholder.** That includes the surname, contact lines, `20XX` dates, every resume bullet, the scenario sentences, and the role tags on skills. The Education line is copied from your Figma mockup.

## Tests

`index.test.js` keeps your original 5 tests and adds 6 under "hiring manager sheets". The new ones depend on this dataset content:

| Test | Looks for |
| --- | --- |
| Opens with roles, scenario and resume | First role is "Interactions and UX"; regions named "Resume preview" and "Tools, skills and languages" |
| Role highlights and switcher sync | A "Motion Design" button, a "Motion" switcher button, and the phrases "explore a direction" and "parallax animation" |
| Cards follow the role | "Figma" under the first role, "Jitter" under Motion Design |
| Scenario swap | A "Marketing team" chip; sentences containing "campaign ideas into on-brand pages" and "prototype in code early" |
| Row hover | A row button "Freelance designer-developer" and an entry with id `freelance` |
| Gap click | Clicking inside a sheet keeps it open; clicking the backdrop closes both |

When you rewrite that copy, update the matching strings in the test file.