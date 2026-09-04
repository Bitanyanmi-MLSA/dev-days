# Dev Days

A multi-project workspace for building and learning through small web projects.

**Live site:** https://Bitanyanmi-MLSA.github.io/dev-days/

## Workspace layout

```text
Dev_Days/
├── index.html                  # Landing page linking to every project
├── projects/
│   ├── 01-dream-career-explorer/
│   ├── 02-data-analyst-portfolio/
│   └── ...
├── shared/
│   ├── assets/                 # Shared images (e.g. Passport.jpg)
│   └── snippets/
├── .nojekyll                   # Serve files as-is on GitHub Pages
└── README.md
```

## Project conventions

- Keep each project self-contained inside `projects/NN-project-name/`.
- Use a two-digit number so projects stay in learning order.
- Keep the main entry point named `index.html`.
- Keep project-specific styles and scripts next to the entry point.
- Put reusable images, snippets, or components in `shared/`.
- Add each new project as a card in the root `index.html`.

## Projects

| # | Project | Status |
|---|---|---|
| 01 | [Dream Career Explorer](projects/01-dream-career-explorer/) | Complete |
| 02 | [Data Analyst Portfolio](projects/02-data-analyst-portfolio/) | Complete |
| 03 | Planned | Ready |
| 04 | Planned | Ready |
| 05 | Planned | Ready |
| 06 | Planned | Ready |
| 07 | Planned | Ready |
| 08 | Planned | Ready |
| 09 | Planned | Ready |
| 10 | Planned | Ready |
| 11 | Planned | Ready |

## Running locally

Some features (like the portfolio contact form) require a real web server and will not
work from `file:///`. Serve the folder over HTTP instead:

```powershell
cd C:\Users\Bitanyanmi\Desktop\Dev_Days
python -m http.server 8777
```

Then open <http://localhost:8777/>.

## Security

These are static sites with no backend, so the attack surface is small. Hardening applied:

- **Content Security Policy** on every page via `<meta http-equiv>`, restricting scripts to
  same-origin only and allowlisting exactly the external origins in use.
- **`script-src 'self'`** with no inline scripts and no inline event handlers anywhere.
- **Referrer policy** set to `strict-origin-when-cross-origin`.
- **`base-uri 'none'`** and **`object-src 'none'`** to block base-tag hijacking and plugin embedding.
- **`form-action`** restricted to the form endpoint (and `'none'` on pages with no forms).
- Contact form uses a honeypot field plus the provider's captcha to limit spam.
- No secrets, tokens, or credentials are stored in the repository.
