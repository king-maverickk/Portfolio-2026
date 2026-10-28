# sheets

The two-column sheets that open from the `(hiring manager)` and `(freelance/contract)` annotations. `(open to work)` still opens the original dark single sheet, which lives in `../index.js`.

## How it fits together

`../index.js` keeps the section (headline, annotations, grid) and the dialog behavior: portal, Esc, focus trap, scroll lock, focus return. It looks the clicked annotation up in `sheets/index.js`:

```js
'hiring-manager': { Component: HiringManagersSheet, glow: '#2864e8', glowAt: { x: '50%', y: 388 } }
freelance:        { Component: FreelanceSheet,      glow: '#22c55e', glowAt: { x: 'calc(100% - 310 * var(--u))', y: 423 } }
```

Found: it renders that sheet over the light backdrop. Not found: the original dark sheet. Title and description come from `SHEET_CONTENT` in `../index.js`.

```
sheets/
├── index.js                  annotation -> sheet map
├── useSheetLayout.js         "scaled" or "stacked"
├── _scale.scss               u(), colors, shared mixins
├── SheetLayout/              dialog shell: header, close button, scaled columns / stacked column
├── HiringManagersSheet/      role switch, resume and cover letter, lists, scenario, Online
├── FreelanceSheet/           workflow, what-you-get and form files; typical-project pill
├── DocumentCard/             paper, file tabs panel, resume/letter renderer, click-to-fit viewer
├── FileTabs/  RoleSwitch/  Scenario/  Benefits/  ReferenceLists/  OnlineSection/  ProfileCards/
├── data/                     all the copy: hiringManagers.js, freelance.js, profiles.js
└── assets/                   the two profile avatars
```

## Editing content

Everything the sheets say is in `data/`. Lines marked `PLACEHOLDER` are stand-ins.

- `data/hiringManagers.js`: roles, benefits, scenario chips, and per role the resume summary, bullets, cover letter and the three lists. Experience (Event support), Projects and Education are shared by every role.
- `data/freelance.js`: the 6-7 weeks text, benefits, chips, workflow tree, prices, problems and the form's wording. `REPLY_TIME` sets the "I reply within..." line.
- `data/profiles.js`: GitHub and LinkedIn cards. The numbers are static: update them by hand.

A scenario sentence must fit the space it is given: 4 lines for hiring managers and 3 for freelance, at the 480-wide column. Longer text pushes the sentence off the bottom of the screen.

## Two layouts

`useSheetLayout` picks one with a media query (`SCALED_QUERY`):

- **scaled** (viewport at least 1000 x 620 and wider than 5:4: desktops and landscape tablets). The design is a 1440 x 900 board. Every size is written `u(N)`, which is `N * var(--u)`, and `--u` is the smaller of `100vw / 1440` and `100dvh / 900` (capped at 1.5px). So the whole sheet scales to fit and never scrolls. The left column hugs the left edge, the right column the right edge, and the middle stays open. Empty space is click-through, so clicking it closes the sheet.
- **stacked** (phones and portrait tablets). One scrolling column, `u` = 1px (at the default font size). On the freelance sheet the three files are stacked instead of tabbed.

Slots keep the DOM in reading order for the stacked layout; `scaledOrder` and `stackedOrder` in each sheet say where each slot goes.

## The resume viewer

In the scaled layout the resume preview fills the paper and fades out at the bottom. Click it (or press the "View full resume" button) and `FitView` shows the whole document at the largest size that fits the screen. Esc, the close button, or a click outside the page closes just the viewer. In the stacked layout the whole resume is shown in the page.

## The contact form

The form on the freelance sheet posts to `/api/contact`. See `/api/README.md` for the Azure Function and its settings.

## Tests

```bash
CI=true npx react-scripts test --watchAll=false src/components/HowIllDeliver
```
