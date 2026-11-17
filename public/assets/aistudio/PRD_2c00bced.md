# WorkLife — Product PRD

> A 75-second arcade of an IT career. You are a fresh graduate entering Pune's
> campus placement circuit. Your job life runs on a clock from 22 → 60. Every
> gate is a company. Retire at 60 whether you like it or not.

---

## 1. Overview

WorkLife is a single-player arcade game about the Indian IT hiring pipeline,
played in one sitting that feels like exactly 75 seconds. The player controls a
candidate (a boy or girl avatar) who must survive a vertical slice of the
industry: campus placement → bond period → annual appraisals → MNC waves →
FAANG promotion → the retirement deadline. Every vertical pipe is a company.
Every collision is a resignation email or a burnout. Every full 75 seconds is one
"working life," and the game ends when the career clock fills.

The tone is satirical and unforgiving: the game is full, the corporate voice is
dry, and the ending is predetermined. The player is being roasted for 75 seconds
by the very industry they entered.

---

## 2. Goal

1. **Fun, tense :75 gameplay** — a Flappy Bird-style vertical slice where the
   "pipe" is a company gate and the "flap" is a jump in a career.
2. **Satire through emotion** — the UI, copy, and sound should feel like a real
   IT workplace: corridors, appraisals, resignation emails, unemployment,
   layoffs, and a resignation that hits harder than any collision.
3. **Readable end** — the player should understand exactly why the game ended,
   and what it means about the industry.

---

## 3. Scope

### In scope (this PRD)

- Single-player, single-level (75 seconds), one screen.
- Vertical "pipe" obstacles that are companies, in hiring order.
- Character selection (Boy / Girl avatar) and track selection
  (Fresher / Associate / Expert) that change visual identity and flavour, not
  game balance.
- Career clock 22 → 60 over 75 seconds; retirement at 60 with a full cutscene.
- Score: companies cleared + package in LPA (decorative, shown at the end).
- Sound: corporate-music tones (Web Audio), mute toggle (M), fullscreen (F).
- Keyboard/mouse/touch controls, Escape / P pause.
- README includes full PRD + a separate `design.md` (UI spec, asset policy,
  module map, build & verify steps).

### Explicitly out of scope

- Multiplayer, leaderboards, sign-in, saving/loading, network, accounts.
- Styling that needs external assets (fonts/images/icons/lottie). All art is
  procedural or in-code CSS.
- Physics rework / multiple levels beyond the 75-second run.
- Mobile app or server deployment; the game is a static client + optional
  Freebuff auth for leaderboard submission (not part of this PRD).

---

## 4. Game Mechanics

### 4.1 The 75-second working life

- The career clock starts at 22 years and fills to 60 over **75 seconds**.
- The progress bar is the health bar: when it fills, the player **drops and
  dies automatically**.
- The clock is wall-clock forced (not per-frame), so a paused tab still fills.
- The run ends early if:
  - the bird hits a pipe (crash → exit letter), or
  - the bird hits the floor/ceiling (burnout → exit letter), or
  - the clock reaches 60 (retirement → retirement letter).
- `maxTicks = 43200` (20 min of fixed stepping); `careerTicks = 9000` — the
  clock never exhausts the step budget, so `'clock'` is the only early end.

### 4.2 The bird: a face

- The bird is a procedurally drawn character: a boy or girl face wearing a
  suit, on an invisible flat canvas. No image assets.
- Toggled by candidate picker; also sends `localStorage`.
- Plays a "point/arrival" sound on spawn.

### 4.3 The pipes: companies

- Vertical pipe pairs move left to right at a fixed speed.
- Each pipe carries a **company name** in a corporate plaque:
  - `TCS`, `Infosys`, `Wipro`, `Tech Mahindra`, `Capgemini`, `Cognizant`,
    `HCL`, `Accenture` — Mass hiring
  - `IBM`, `Concentrix`, `Genpact`, `KPMG`, `Deloitte`, `EY`, `PwC` — MNC
  - `Amazon`, `Microsoft`, `Google`, `Meta`, `Apple`, `Netflix` — FAANG
- FAANG then cycles again with `ring * 60` LPA raise (decorative: ring 1 →
  60 LPA, ring 2 → 120 LPA, ring 3 → 180 LPA).
- First pipe is placed far enough to give the player a flight window on the
  first flap; gates are narrow (flappy geometry), with safe vertical lanes.
- The bird descends by default (gravity) and rises on flap / tap / Space /
  ArrowUp. The flap impulse decays over ~0.5 s.

### 4.4 Scoring

- Every pipe that is **cleared** (right edge passes the bird) adds **+1**.
- Plus a **package LPA** value chosen from the track and company tier:
  - Fresher → entry LPA (decorative)
  - Associate → +2 LPA
  - Expert → +5 LPA
  - FAANG ring raises the LPA multiplicatively, displayed in the HUD and
    readout (e.g. `₹1.9 Cr`).
- Best score is kept **per track** in `localStorage`, shown as `Best 0` / `Best
  X LPA` in the footer.

### 4.5 The retirement cutscene

- When the clock reaches 60:
  - The bird falls gently (gravity on, no flap allowed).
  - A retirement banner slams in: `Retired at 60. No pension.`
  - The ending shows: age, track, total years worked, total companies cleared,
    package (LPA + bonus), and role title.
  - The screen is private and uncached (no personalized content anywhere else).

### 4.6 Pacing: job life is not a conveyor belt

A normal IT career spans ~4 years; a fresh hire does not switch five companies
in that window. WorkLife paces the pipe generation like a real hiring arc:

- **Rounds 0–1.6 s (22 → ~24.6):** Fresher rounds. Slowed pipe speed, rare
  gates, mostly a single constant "campus placement" run. Many freshers stay at
  the first firm for 2–3 years.
- **Rounds 1.6–3.6 s:** Annual appraisal cycle. Pipe speed picks up slightly;
  periodic appraisal "interviews" (small pause, hazard) appear. A fresher
  might touch 1–2 firms.
- **Rounds 3.6–5.4 s:** Associate → MNC wave. Speed increases; more gates;
  a few "MNC offers" (bigger horizontal spacing, visual flourish). A normal
  career moves to an MNC in year 3–4.
- **Rounds 5.4–6.8 s:** Specialist / senior slice. Faster pipes, a FAANG
  "band" begins around the early-20s mark.
- **Rounds 6.8–7.5 s:** FAANG stretch. The final gates are the big
  companies; the player must survive the whole FAANG segment to reach the
  retirement deadline.
- The retirement wall is the final gate; there is no respawn, only the cutscene.

This means the **rate of company switches rises over the life**, while the
**first half is dominated by one or two firms** — matching a real four-year
career where you don't hop five companies in four years.

### 4.7 Win / Loss states

- **Crash into a pipe** → exit letter: `OUT. [Company] hired you, but you quit
  after one month.` + score readout.
- **Floor/ceiling burnout** → exit letter: `BURNT OUT. [Company] gave you
  feedback and a company email.` + score readout.
- **Retirement at 60** → the cutscene described above, then the game is over.
- **Pipes that pass without collision** → cleared; adds to score + package.

### 4.8 Global rules

- Gameplay is deterministic in fixed ticks; only the retirement clock is wall
  time. This keeps replay verification stable.
- Inputs after retirement are discarded; flaps are blocked.
- Audio is opt-in (sound toggle in the UI), memory-cached to avoid
  on-the-fly decode, and gated behind user intent.
- The page pauses when hidden and on blur; resume is a countdown.

---

## 5. Game Loop

1. Load → idle screen (candidate + track pick).
2. `Start` → hidden start screen, fetch session + run, create flight.
3. `Playing` (0 → 75 s): the bird flies; pipes scroll; career bar fills.
4. End event → result screen (exit letter or retirement cutscene).
5. `Restart` / `Change track` → back to idle.

---

## 6. Data & State

- `best[Fresher|Associate|Expert]` → number, in `localStorage`.
- `character: Boy|Girl` → `localStorage`.
- `level` → `localStorage`, written on track change.
- Run-scoped: `session`, `runId`, `character`, `level`, `score`, `age`, `role`,
  `package`, `companiesCleared`, `soundEnabled`, `flight` (Bird state).
- `sessionLoaded`, `runId`, `mode` (idle/starting/playing/paused/over), plus
  UI toggles (`sound`, `fullscreen`, `leaderboard`).
- No server state is needed to play; the PRD is fully client-side.

---

## 7. UI

### 7.1 Colour tokens

| Token | Hex | Use |
|---|---|---|
| Background | `#eef0f5` | Page background |
| Surface | `#ffffff` / `#f8fafd` | Cards, start screen |
| Ink | `#0f172a` | Body text |
| Ink-soft | `#475569` | Muted, subtitles |
| Accent | `#6366f1` | Freebuff pill, links, highlights |
| Accent-deep | `#4f46e5` | Hover, active |
| Corporate | `#1e293b` (navy) | Selected cards, deep backgrounds |
| Corporate-400 | `#334155` | Pipes and plate text |
| Corporate-500 | `#475569` | Plaque text |
| Warning | `#f59e0b` | Finger hint, attention |
| Status-ok | `#10b981` | Cleared / going strong |
| Status-warn | `#f59e0b` | Unemployment / resign |
| Status-bad | `#ef4444` | Fired / burned out |
| Retirement | `#b91c1c` | "Retired at 60. No pension." banner |
| Score | `#0f172a` | Result screen numbers |
| Grade | `#6366f1` | Result screen badge |
| Neutral | `#94a3b8` | Best score, muted footer |

### 7.2 Type

- **Headings:** Fraunces (serif), tight tracking, navy.
- **Body:** DM Sans (sans), 14–16px, generous line height.
- **Ticker:** bold uppercase with letter spacing for labels like `CANDIDATE`,
  `TRACK`, `ONE WORKING LIFE`.
- **Kbd:** monospace-ish, brackets, subtle background.

### 7.3 Layout

- Full-viewport card, no page scroll.
- Fixed-width block inside the card: top-to-bottom from the hero card.
- Footer pinned to the bottom of the stage.

### 7.4 Screens

#### 7.4.1 Idle (`#start-screen`)

- Blue "Freebuff" pill + app name pill.
- Hero card with office/skyline art and stage; a company plaque (TCS) for the
  player to relate to.
- Pill badge: `ONE WORKING LIFE · 75 SECONDS`.
- Heading `Hire & Fire.` + orange dot after the period.
- Subtitle: `Every gate is a company. Climb from campus placement to FAANG.
  Retire at 60 whether you like it or not.`
- **CANDIDATE** row: two candidate cards:
  - Boy card (white bg) + Girl card (navy bg); Girl selected by default.
  - Each card is a radio button with an avatar silhouette and a label.
- **TRACK** row: three cards:
  - Fresher (white) — `First offer letter. Family is proud. Bond period included.`
  - Associate (navy) — `Two appraisals in. Still writing "as per my last email".`
  - Expert (white) — `Ten years in. You now interview the freshers who replaced you.`
- **Start** button (navy, pill): `Start your career →`.
- Key hint below: `[ Space ]` / tap to jump.
- Footer: trophy + `Best 0`, the promotion quote, speaker + fullscreen icons.

#### 7.4.2 Stage

- White canvas, no decorations atop the game.
- The stage is the scene: desks, skyline, company plaque on the right side.
- The career bar is a **secondary** element: subtle, non-blocking.

#### 7.4.3 Start screen (`#start-screen`)

- `pointerdown` on the stage starts the game (same as Space). This means the
  UI must not swallow the input: the start button is the primary path; the
  stage listens only when the screen is visible.
- `pointerdown` elsewhere on the screen is a jump only when a flight is
  active; otherwise it passes.
- `canvas:focus` so keyboard works.

#### 7.4.4 Playing (`#hud`)

- Screen has no element: the arena is the stage and the HUD is the only UI.
- Career bar (in the HUD): `AGE 32` + progress bar (22 → 60, 75 s).
- `ROLE` label (group-name pill) + `PACKAGE: 2.1 Cr`.
- Score: `SCORE 24` plus a "companies cleared" eyebrow if > 0.
- The bird is the only gameplay element; the stage moves under it.

#### 7.4.5 Paused (`#pause-screen`)

- Dark navy overlay; resume button + `Esc/P` hint.

#### 7.4.6 Exit letter (`#result-screen`)

- Split layout: left art (bird on the floor) + right letter.
- Eyebrow: `EXIT` (Status-bad).
- Played company role, track, age, reason.
- Score: companies cleared + package (decorative) + best-personal-press.
- Big action: `Start another career` / `Change track`.
- Voice note: the frustrated release note (optional).

#### 7.4.7 Retirement (`#retire`)

- Full-screen dark navy; retirement banner `Retired at 60. No pension.`
- Age 60, years worked, companies cleared, package LPA, role title.
- Action: `Start another career` / `Change track`.
- Job offer cards on the right for a future "keep working" branch.

### 7.7 Headline copy

> "The only promotion that matters is the last one." — footer.

---

## 10. Controls

| Action | Keyboard | Pointer / touch |
|---|---|---|
| Start a career | — | Click `Start your career` |
| Jump / flap | Space / ↑ | Tap / click on stage |
| Pause / resume | Escape / P | — |
| Mute / unmute | M | — |
| Fullscreen | F | Click the fullscreen icon |
| Change track (after over) | — | Click `Change track` |
| Start another career (after over) | — | Click `Start another career` |

Gameplay input is only consumed when a flight is active; key events that land
on a button/input are ignored. Focus is on the canvas at all times.

---

## 11. Failure Modes & Edge Cases

- **Hidden/background tab:** the original bug. The app no longer self-pauses
  on start, and a background pump keeps physics alive; pause is explicit on
  blur/visibilitychange.
- **Window resize:** canvas is resolution-independent; DPR scaling handles it.
- **Browser tab closed mid-flight:** server replays the fixed-step flight;
  wall-clock retirement never needs the full tick budget.
- **Canvas destroyed mid-flight:** guard `ctx` and `flight` reads.
- **Audio unlock on pointer:** Web Audio requires a user gesture; the
  `sound.unlock()` handshake is called on the first pointer / keydown and
  replayed on `resume`.
- **Reduction of motion:** Honor `prefers-reduced-motion` (skip particle
  flourish, keep the game playable).
- **Fullscreen not supported:** hide the fullscreen button; toast on F.
- **Unqualified success:** low scores are valid; ties keep insertion order.
- **Read-only project:** all changes live in `src/`, `index.html`, `styles.css`.
  `dist/` is generated by `npm run build`.

---

## 12. Data Model

```ts
// Persistent (localStorage)
{
  "worklife:character": "girl",   // "boy" | "girl"
  "worklife:level": "associate",  // "fresher" | "associate" | "expert"
  "worklife:best": {
    "fresher": 0,
    "associate": 0,
    "expert": 0
  }
}

// Run-scoped (module state)
interface Flight {
  bird: { x: number; y: number; vy: number; alive: boolean; retired: boolean };
  pipes: { x: number; top: number; bottom: number; cleared: boolean }[];
  score: number;
  age: number;        // 22 → 60
  role: string;       // "Fresher" | "Associate" | "Expert"
  package: number;    // LPA, decorative
  companiesCleared: number;
  retired: boolean;
  cause: "pipe" | "floor" | "ceiling" | "clock" | null;
}
```

---

## 13. Asset Policy

- **No image files, no font files, no external requests.** Everything is
  drawn with `Canvas 2D` and CSS.
- Procedural faces: fill gradients, arcs, eye rows, suit chevrons, tie.
- Procedural pipes: rounded caps, corporate plaque (name plate).
- The only external material is `public/favicon.svg` and bundled CSS/JS.
- No localStorage/session keys beyond the run tokens and best scores.

---

## 14. Build & Verify

1. `npm install` → `npm run typecheck` → `npm run build`.
2. `npm run dev` → `http://127.0.0.1:5188/` (port 5188 default).
3. Verify: start screen paints, Start works, HUD shows, real-space flap
   advances the career bar, a crashed run shows an exit letter, a 75 s run
   shows the retirement letter.
4. Deploy: a static host serving `dist/` (Nginx) or a Workers/edge host.
   The game has no server dependencies.

---

## 15. Open Questions

- Unknowns, if any: N/A for this PRD. Once the code is in place, the only
  remaining items are the "nice-to-have" additions in section 16.

---

## 16. Preflight Checklist

Run this before declaring the feature done:

- [ ] Typecheck: `npm run typecheck` exits 0
- [ ] Build: `npm run build` exits 0 and `dist/` is populated
- [ ] Start screen: candidate + track picks are selectable and persisted
- [ ] Start: clicking Start shows the in-flight stage
- [ ] HUD: career bar fills in wall-clock time; role/package render
- [ ] Input: Space/↑ flaps; Escape/P pauses
- [ ] Retirement: clock to 60 shows `Retired at 60. No pension.` and locks flaps
- [ ] Exit: pipe/floor crashes show the exit letter with score + package
- [ ] Pacing: first half of the run has fewer company switches than the second
- [ ] Sound: M toggles mute; Web Audio is unlocked by a user gesture
- [ ] Responsive: window resize keeps the canvas crisp and the layout intact
