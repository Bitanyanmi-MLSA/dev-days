# Data Analyst Portfolio

A responsive portfolio site for a data analyst with a Power BI focus.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and content |
| `style.css` | All styling and responsive layout |
| `app.js` | Project filters, case-study modals, contact form |

The portrait is loaded from the shared workspace folder: `../../shared/assets/Passport.jpg`.

## Contact form

Messages sent from the site are delivered by email to **justicennyiimock@gmail.com** using
[FormSubmit](https://formsubmit.co) — a free forwarding service, so no backend or server code is required.

### One-time activation (required)

1. Open your inbox at `justicennyiimock@gmail.com`.
2. Find the email from FormSubmit and click **Activate Form**.
3. After that, every message submitted on the site arrives in your inbox.

Until you activate, the form falls back to opening the visitor's email app addressed to you.

### Important: it needs a web server

FormSubmit rejects submissions from pages opened directly as files (`file:///...`).
To test the form locally, serve the folder over HTTP instead of double-clicking `index.html`:

```powershell
cd C:\Users\Bitanyanmi\Desktop\Dev_Days
python -m http.server 8777
```

Then visit <http://localhost:8777/projects/02-data-analyst-portfolio/index.html>.

Once the site is hosted (GitHub Pages, Netlify, Vercel, etc.) it works normally.

### Hiding your email address in the page source

After activating, FormSubmit gives you a random alias so your address isn't visible in the HTML.
Swap it into the form's `action` attribute in `index.html`:

```html
<form action="https://formsubmit.co/ajax/YOUR-ALIAS-HERE" method="POST">
```

### How it behaves

- Submits in the background, so the visitor stays on the page.
- Shows sending, success, and error states inline.
- Includes a hidden honeypot field to reduce spam.
- If sending fails for any reason, it offers a direct "Email me instead" link.

## Changing the destination email

Update both places:

1. The `action` URL on `#contactForm` in `index.html`.
2. The `OWNER_EMAIL` constant near the contact logic in `app.js`.
3. The `mailto:` link in the contact section of `index.html`.
