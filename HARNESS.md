# Website harness

For every change: read `src/data/legacy-routes.json`, make the smallest edit, then run `npm run harness`.

The loop is complete only when build, route/SEO/link verification, browser checks, and all four screenshots pass. Inspect `artifacts/screenshots/` before accepting visual work. Fix failures and repeat; never update the route manifest merely to hide a missing page.
