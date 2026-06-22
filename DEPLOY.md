# Deploying the Neuroid Portfolio

The live, hostable page is the **`site/`** folder. It's a plain static site
(no build step) — every host below serves it as-is, and **all animations work**
because they're client-side CSS/JS (marquees, scroll reveals, lightbox, and the
muted-autoplay video wall). The creative **videos stream from your Cloudinary**,
so nothing extra needs hosting for those.

---

## 1. Put the codebase on GitHub

If you don't have the repo on GitHub yet, create an empty repo at
<https://github.com/new> (e.g. `neuroid-portfolio`), then from this project root:

```bash
git remote add origin https://github.com/<your-username>/neuroid-portfolio.git
git push -u origin main
```

(If you use SSH: `git@github.com:<your-username>/neuroid-portfolio.git`.)

---

## 2. Deploy with Vercel (recommended)

Connecting the GitHub repo means every push auto-deploys.

1. Go to <https://vercel.com/new> and **Import** the GitHub repo.
2. In the import settings:
   - **Root Directory:** `site`   ← important (the deployable files live here)
   - **Framework Preset:** `Other`
   - **Build Command:** *(leave empty)*
   - **Output Directory:** *(leave empty)*
3. Click **Deploy**. You get a live `*.vercel.app` URL in ~30s.
4. Add your custom domain under **Project → Settings → Domains** (free HTTPS).

That's it — pushes to `main` redeploy automatically.

---

## Alternatives (also free, also static)
- **Netlify:** import the repo, set base directory to `site`, no build command.
- **Cloudflare Pages:** connect repo, build output dir = `site`.
- **Drag-and-drop:** unzip `neuroid-portfolio-site.zip` and drop the `site`
  folder onto Netlify Drop / the Vercel dashboard — no git needed.

---

## Repo layout
- `site/` — the deployable static site (`index.html` + `assets/` + design-system CSS/fonts).
- `site/webflow/bundle.js` — the page as one injectable custom-code script (for a
  paid-Webflow custom-code embed, if you ever go that route).
- `project/` — the original Claude Design prototype + source assets.
- `chats/`, `README.md` — design handoff context.
