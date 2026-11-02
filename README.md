# Grishma Balgi · Robotics & Mechatronics

[Live portfolio](https://grishmabalgi1311.github.io/grishma-portfolio/) · [Engineering project collection](https://github.com/grishmabalgi1311/engineering-projects)

A fast, buildless portfolio with discipline-aware recruiter paths, a local 3D engineering workbench, searchable case studies, original project images, and direct links to source and evidence.

## Preview

```sh
python -m http.server 8765
```

Open http://localhost:8765. GitHub Pages serves the repository root. All local URLs work under `/grishma-portfolio/`.

## Structure

- `index.html` — identity, navigation, workbench, project collection, background, contact.
- `project-data.js` — original detailed project records.
- `app.js` — concise presentation, evidence metrics, filtering, search, dialogs and deep links.
- `workbench.js` — local Canvas-based 3D renderer; drag/orbit, input controls, optional rotation, lazy-loaded original tentacle mesh.
- `assets/` — optimized original images and mesh data; attribution in `ASSET_PROVENANCE.json`.
- `resumes/` — existing published resume.

## Direct links

Use `?track=mechanical`, `?track=embedded`, `?track=robotics`, `?track=simulation`, or `?track=ml` to open a recruiter path. Use `#project=kinetikey` (or another project ID) to open a case study directly.

## Evidence and interactions

The ATV workbench is a simplified reconstruction from original team CAD views, not the manufacturing assembly. The tentacle workbench renders original CAD-derived segment meshes with illustrative articulation; it does not execute MuJoCo or validate material behavior. The board, robot-arm and navigation views are explanatory illustrations. The gesture time-warp demonstration illustrates timing variation and is not a recognition benchmark.

The navigation comparison is 2,451 to 1,418 executed ticks (42.1% fewer), 6/10 to 7/10, and SPL 0.358 to 0.619 in preserved midterm evaluations. The 718-step, 10/10 result is a separate saved evaluation. Neither establishes general success across environments. Circuit-breaker accuracy is explicitly synthetic-data performance. Unfinished integrations, team contributions and calibration needs remain identified.

## Accessibility and performance

Semantic navigation, visible focus, native dialogs with Escape and restored focus, labeled controls, result announcements, reduced-motion support, mobile layouts, lazy-loaded images, and a mesh loaded only when needed. Rotation starts paused and stops drawing when the workbench is off screen or the document is hidden. No analytics, trackers, build framework, or third-party 3D engine.

## Validation

JavaScript syntax, local resource checks and isolated Chromium interaction tests cover discipline selection, searching, project dialogs, keyboard dismissal, workbench controls, deep links and responsive widths from 320 to 1440 pixels. This validates the website experience; it does not establish new simulator or hardware results.
