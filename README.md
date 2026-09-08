# Bitanyanmi — Portfolio & Dev Days

My data analyst portfolio, plus a growing collection of small web projects.

**Live site:** https://bitanyanmi-mlsa.github.io/dev-days/

- **Landing page** → the portfolio (`index.html`)
- **Projects gallery** → `projects.html`, reachable from the nav, the "Explore projects" banner, and the footer

## Layout

```text
/
├── index.html          # Portfolio — the landing page
├── style.css           # Portfolio styles
├── app.js              # Portfolio behaviour (filters, modals, contact form)
├── projects.html       # Gallery of all side projects
├── case-studies/       # Long-form analytics case studies
│   └── olist-retail-analytics.html
├── projects/
│   └── 01-dream-career-explorer/
├── shared/
│   ├── assets/         # Shared images (Passport.jpg)
│   └── snippets/
├── .nojekyll           # Serve files as-is on GitHub Pages
├── CONTACT-FORM.md     # Contact form setup & troubleshooting
├── VISITOR-COUNTER.md  # How the visit counter works & how to read it
└── README.md
```

## Adding a new project

1. Create `projects/NN-project-name/` with an `index.html` inside.
2. Keep its `style.css` and `app.js` next to the entry point.
3. Put shared images in `shared/assets/`.
4. Add a card for it in `projects.html`.
5. Add a row to the table below.

## Adding a new analytics case study

Case studies are the data work — separate from the web builds in `projects/`.

1. Create `case-studies/name.html`. Copy `olist-retail-analytics.html` as the starting point;
   each page is self-contained (inline `<style>`, no shared CSS) like `projects.html`.
2. Add an entry to `projectDetails` in `app.js`, keyed by the card's `data-project`.
   Include a `link` property to surface a "Read the full case study" button in the modal.
3. Add the card to the `.project-grid` in `index.html`. Give it `data-project` and
   `data-category` values matching the filter buttons above the grid.
4. Only publish figures you can reproduce from the source data.

## Case studies

| Project | Page | Source data | Status |
|---|---|---|---|
| Olist Retail Analytics | [`case-studies/olist-retail-analytics.html`](case-studies/olist-retail-analytics.html) | Olist public dataset (Kaggle, CC BY-NC-SA 4.0) | Published — screenshots pending |
| Ghana Regional Sales | — (modal only) | Private extract | Analysis complete, page not written |

> The `.pbix` files and their source CSVs are **not** kept in this repo — they are hundreds of
> megabytes and GitHub Pages cannot render them. The case-study pages carry the findings,
> screenshots, and (optionally) a Power BI "Publish to web" embed instead.

## Projects

| # | Project | Location | Status |
|---|---|---|---|
| 01 | Dream Career Explorer | [`projects/01-dream-career-explorer/`](projects/01-dream-career-explorer/) | Complete |
| 02 | Data Analyst Portfolio | site root (`index.html`) | Complete |
| 03 | School Election Voting App | [`projects/03-school-election-voting/`](projects/03-school-election-voting/) | Complete |
| 04 | — | — | Planned |

## Running locally

The contact form needs a real web server and will not work from `file:///`.
Serve the folder over HTTP instead:

```powershell
cd C:\Users\Bitanyanmi\Desktop\Dev_Days
python -m http.server 8777
```

Then open <http://localhost:8777/>.

## Deploying

GitHub Pages serves the `main` branch root. Any push goes live automatically:

```powershell
git add -A
git commit -m "Your message"
git push
```

## Visitor counter

The portfolio footer shows a live visit count, powered by a free, cookie-free counter.
Check the total any time without adding to it:

<https://abacus.jasoncameron.dev/get/bitanyanmi-mlsa-dev-days/visits-live>

See [`VISITOR-COUNTER.md`](VISITOR-COUNTER.md) for details.

## Security

Static sites with no backend, so the attack surface is small. Hardening applied:

- **Content Security Policy** on every page via `<meta http-equiv>`, restricting scripts to
  same-origin only and allowlisting exactly the external origins in use.
- **`script-src 'self'`** — no inline scripts and no inline event handlers anywhere.
- **Referrer policy** set to `strict-origin-when-cross-origin`.
- **`base-uri 'none'`** and **`object-src 'none'`** to block base-tag hijacking and plugin embedding.
- **`form-action`** restricted to the form endpoint (`'none'` on pages with no forms).
- **`frame-src`** on case-study pages allows only `https://app.powerbi.com`, for optional
  Power BI "Publish to web" embeds. No other origin may be framed.
- Contact form uses a honeypot field plus the provider's captcha to limit spam.
- HTTPS enforced; plain HTTP redirects with a 301.
- No secrets, tokens, or credentials are stored in the repository.
