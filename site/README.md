# Neuroid — Portfolio (deployable site)

This is the real, hostable build of the `Portfolio.dc.html` Claude Design prototype,
rebuilt as a **single self-contained static page** with no build step and no private
runtime. It renders identically to the Claude Design preview and runs on any static host.

## Contents
- `index.html` — the whole page (markup + styles + vanilla JS). No framework, no bundler.
- `assets/` — brand logos, brand-wall logos, and static creatives (local).
- `_ds/…/` — the Neuroid design system tokens (colors, type, spacing, effects) + fonts.
- Videos stream from **Cloudinary** (already public URLs) — nothing to host for those.

## Run locally
Just open `index.html`, or serve the folder:
```bash
cd site
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy
Anything that serves static files works. The folder *is* the site — point the host at it.

- **Vercel:** `npm i -g vercel && vercel` from inside `site/` (no framework, output dir = `.`).
  Or drag the folder into the Vercel dashboard.
- **Netlify / Cloudflare Pages:** drag-and-drop the `site/` folder, or connect the repo and
  set the publish directory to `site`. No build command needed.
- **GitHub Pages:** push and serve `site/` from the Pages settings.
- **Webflow:** host this folder on one of the above and link/embed it, or paste `index.html`
  into a Webflow **HTML embed** page (note Webflow's embed size limits — hosting the folder
  and pointing Webflow at it is the cleaner path for a page this heavy).

## Notes
- Home / Services / About nav + footer links are placeholders (`#`) — Portfolio only for now.
  Wire them up when the Home shell is built.
- Reduced-motion users get a static page (marquees/reveals disabled) automatically.
