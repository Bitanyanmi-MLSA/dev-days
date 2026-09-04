# Contact form

Messages sent from the portfolio are delivered by email to **justicennyiimock@gmail.com**
using [FormSubmit](https://formsubmit.co) — a free forwarding service, so no backend is required.

The form lives in `index.html` (the `#contactForm` element) and its logic is at the bottom of `app.js`.

## Activation is per domain

FormSubmit requires a one-time activation **for each domain the form is submitted from**.
That means `localhost` and your live GitHub Pages domain each need activating separately.

When a new domain first submits, FormSubmit emails you an **"Activate Form"** link.
Click it once, and submissions from that domain start arriving.

| Domain | Purpose |
|---|---|
| `localhost:8777` | Local testing |
| `bitanyanmi-mlsa.github.io` | Live site |

## It needs a real web server

FormSubmit rejects submissions from pages opened directly as files (`file:///...`).
To test locally, serve the folder over HTTP rather than double-clicking `index.html`:

```powershell
cd C:\Users\Bitanyanmi\Desktop\Dev_Days
python -m http.server 8777
```

Then visit <http://localhost:8777/>.

## Hiding your email from the page source

After activating, FormSubmit gives you a random alias so your address isn't visible in the HTML.
Swap it into the form's `action` in `index.html`:

```html
<form action="https://formsubmit.co/ajax/YOUR-ALIAS-HERE" method="POST">
```

Note the CSP already allows `https://formsubmit.co`, so no other change is needed.

## How it behaves

- Submits in the background, so the visitor stays on the page.
- Shows sending, success, and error states inline.
- Hidden honeypot field plus the provider's captcha to reduce spam.
- If sending fails for any reason, it offers a direct "Email me instead" link.

## Changing the destination email

Update all three places:

1. The `action` URL on `#contactForm` in `index.html`.
2. The `mailto:` link in the contact section of `index.html`.
3. The `OWNER_EMAIL` constant in `app.js`.
