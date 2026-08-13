# Mini Me Life Forecaster

A polished, privacy-first, browser-based "mini you" that turns a short personal data journal into a seven-day life forecast. It runs entirely in the browser: no accounts, no server, and no data leaves the page.

## Highlights

- Interactive signal journal for mood, energy, focus, sleep, stress, social battery, commitments, habits, and goals.
- Local heuristic persona model with resilience, load, pressure, recovery, and archetype scoring.
- Cinematic dashboard with KPI cards, trajectory visualization, weekly plan cards, and contextual recommendations.
- Self-contained static app with a small Node test suite for the forecasting engine.

## Run locally

Open `index.html` in any modern browser, or serve the folder:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Test

```bash
node tests/forecaster.test.js
```

## Note

This is a reflective planning tool, not medical, legal, financial, or mental-health advice. Predictions are heuristic and should be treated as prompts for planning rather than facts.
