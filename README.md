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

The ATV workbench is a simplified reconstruction from original team CAD views, not the manufacturing assembly. The tentacle workbench renders original CAD-derived segment meshes with illustrative articulation; it does not execute MuJoCo or validate material behavior. The impact rig and robot-arm are explanatory illustrations. The maze is an original, interactive toy navigation demonstration inspired by the AI4CE course introduction. The gesture time-warp demonstration illustrates timing variation and is not a recognition benchmark.

The navigation comparison is 2,451 to 1,418 executed ticks (42.1% fewer), 6/10 to 7/10, and SPL 0.358 to 0.619 in preserved midterm evaluations. The 718-step, 10/10 result is a separate saved evaluation. Neither establishes general success across environments. Circuit-breaker accuracy is explicitly synthetic-data performance. Unfinished integrations, team contributions and calibration needs remain identified.

## Accessibility and performance

Semantic navigation, visible focus, native dialogs with Escape and restored focus, labeled controls, result announcements, reduced-motion support, mobile layouts, lazy-loaded images, and a mesh loaded only when needed. Rotation starts paused and stops drawing when the workbench is off screen or the document is hidden. No analytics, trackers, build framework, or third-party 3D engine.

## Validation

JavaScript syntax, local resource checks and isolated Chromium interaction tests cover discipline selection, searching, project dialogs, keyboard dismissal, workbench controls, deep links and responsive widths from 320 to 1440 pixels. This validates the website experience; it does not establish new simulator or hardware results.

## Impact sensing and maze interaction

The embedded view replaces its slider with **Strike & record**: a hammer strikes an instrumented plate and captures a synthetic damped vibration response, in arbitrary units. It supports repeated and keyboard-triggered captures and an immediate reduced-motion view. This is an explanatory interaction, not a measured hardware trace.

The perception view provides **Run route**, pause, and reset controls for an original 3D toy maze. A small robot moves toward an image-goal marker while visited areas and the route become visible. It is not a replay or benchmark of the submitted navigation policy. No AI4CE code or textures are copied.

## Project media and recognition

The original 14 cards have project-specific imagery and framing. Five case studies include silent, compressed original demo excerpts, loaded on demand and paused when the dialog closes. Concept images for the fin rig, finger mechanism, road scenario, ECG pipeline and breaker sensing are visibly labeled **AI concept**. Actual CAD, prototype footage, model visualizations and experimental results retain their separate provenance. See `ASSET_PROVENANCE.json` and `IMAGE_PROMPTS.json`.

Recognition includes the Allianz Tech Championship win for the EcoSteps FlutterFlow prototype and the EUR 3,000 award confirmed by Grishma, plus explicitly labeled VJTI Racing team awards from the CV. Dates, production deployment and user-impact metrics are not inferred for EcoSteps. See `RECOGNITION_PROVENANCE.json`.

Baymax and FlexiClimber thumbnails use reference-guided **AI reconstructions** of the original prototypes, visibly labeled. Original footage remains available in the case studies. Renderings preserve recognizable appearance but are not exact manufacturing records.

## CV review and project-media revision

The portfolio now has 20 project case studies: 14 curated artifact collections and six additional CV-documented summaries. New summaries cover Wall-E, adaptive recumbent bicycle design, sugarcane-juicer design, FDM defect detection, EcoSteps, and circuit-breaker reduced-order modeling. They distinguish CV-reported work from recovered source files and measured results. Full private CV and employer models are excluded. See `CV_PROJECT_PROVENANCE.json`.

KinetiKey uses an AI board concept with original footage retained. The 360° Rotating Drilling Machine uses a CAD-guided AI visualization, plus the original report/CAD image. Camera-only Robot Navigation has an authored system diagram, an interactive four-stage explanation and a link to the toy-maze workbench. Preserved evaluation metrics are unchanged. New CV project diagrams explain mechanisms or interfaces; they are not original project geometry or test results.

The revised portrait uses identity-preserving AI-assisted background and exposure cleanup of the original event photo. The original is retained outside the publication. Exact built-in ImageGen prompts for this revision are saved in `IMAGE_PROMPTS_V4.json`.
