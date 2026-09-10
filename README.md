# Bitanyanmi — Portfolio & Dev Days

My data analyst portfolio, plus a growing collection of small web projects.

**Live site:** https://bitanyanmi-mlsa.github.io/dev-days/

- **Landing page** → the portfolio (`index.html`)
- **Notes / blog** → `blog/`, reachable from the nav and the footer
- **Projects gallery** → `projects.html`, reachable from the nav, the "Explore projects" banner, and the footer

## Layout

```text
/
├── index.html          # Portfolio — the landing page
├── style.css           # Portfolio styles
├── app.js              # Portfolio behaviour (filters, modals, contact form)
├── projects.html       # Gallery of all side projects
├── blog/               # Notes — short technical write-ups
│   └── index.html      # Post list
├── case-studies/       # Long-form analytics case studies
│   ├── olist-retail-analytics.html
│   └── ghana-regional-sales.html
├── projects/
│   └── 01-dream-career-explorer/
├── shared/
│   ├── assets/         # Shared images (Passport.jpg)
│   └── snippets/       # Reusable DAX (dax/) and Power Query (power-query/)
├── .nojekyll           # Serve files as-is on GitHub Pages
├── CONTACT-FORM.md     # Contact form setup & troubleshooting
├── CONTRIBUTION-LOG.md # Dated record of talks, posts, answers and reach
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
| Ghana Regional Sales | [`case-studies/ghana-regional-sales.html`](case-studies/ghana-regional-sales.html) | Private extract | Published — QA screenshot pending (mask region labels first) |

> The `.pbix` files and their source CSVs are **not** kept in this repo — they are hundreds of
> megabytes and GitHub Pages cannot render them. The case-study pages carry the findings,
> screenshots, and (optionally) a Power BI "Publish to web" embed instead.
>
> "Publish to web" makes a report and its data public to anyone with the link. It is fine for
> the public Olist dataset and must never be used for the private Ghana extract.

## Adding a note (blog post)

Notes are short technical write-ups — the "learn from me" half of the site, kept separate from
the long-form case studies.

1. Copy an existing file in `blog/` and rename it to a short slug, no date in the filename.
2. Update the `<title>`, the meta description, the date, the reading time and the body.
3. Add a matching `<a class="post">` block at the **top** of the list in `blog/index.html`.
4. Post pages carry no JavaScript — leave `script-src 'none'` in the CSP as it is.
5. Publish the code you reference into `shared/snippets/` and link to it.
6. Log the post in [`CONTRIBUTION-LOG.md`](CONTRIBUTION-LOG.md) the same day.

## Notes

| Note | Page |
|---|---|
| Appending two extracts is a decision, not a step | [`blog/appending-two-extracts-is-a-decision.html`](blog/appending-two-extracts-is-a-decision.html) |
| Three joins that quietly break a Power BI model | [`blog/three-joins-that-break-a-power-bi-model.html`](blog/three-joins-that-break-a-power-bi-model.html) |

## Snippets

`shared/snippets/` holds the reusable DAX (`dax/`) and Power Query (`power-query/`) lifted out
of the case studies, documented in [`shared/snippets/README.md`](shared/snippets/README.md).
The notes and case studies link to these files by path, so keep the paths stable when renaming.

## Contribution log

[`CONTRIBUTION-LOG.md`](CONTRIBUTION-LOG.md) is a dated record of public contributions — talks,
posts, forum answers, tools — with the reach figure and an evidence link for each. It is filled
in the day something happens, because reach numbers and event pages do not stay put.

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
- **`frame-src`** on the Olist case-study page allows only `https://app.powerbi.com`, for an
  optional Power BI "Publish to web" embed. No other origin may be framed. Pages that will
  never carry an embed — including the Ghana case study, which uses private data — omit
  `frame-src` entirely and fall back to `default-src 'self'`.
- Contact form uses a honeypot field plus the provider's captcha to limit spam.
- HTTPS enforced; plain HTTP redirects with a 301.
- No secrets, tokens, or credentials are stored in the repository.
