# Visitor counter

The portfolio footer shows how many people have visited the site.

## How it works

It uses [Abacus](https://abacus.jasoncameron.dev) — a free, no-signup, cookie-free
hit counter. No account, no tracking scripts, and no personal data is collected.

- **Counter location:** footer of `index.html` (`#visitCounter`)
- **Logic:** bottom of `app.js`
- **Namespace / key:** `bitanyanmi-mlsa-dev-days` / `site-visits`

A visit is counted **once per browser session**, so refreshing the page does not
inflate the number. Later page views in the same session simply read the current total.

If the counter service is ever unreachable, the counter hides itself silently —
the rest of the page is unaffected.

## Checking your count without visiting the site

Open this link in any browser. It **reads** the total without adding to it:

<https://abacus.jasoncameron.dev/get/bitanyanmi-mlsa-dev-days/site-visits>

It returns a small piece of JSON:

```json
{ "value": 42 }
```

> Do **not** use the `/hit/` URL to check — that one increments the count.

## Resetting or starting fresh

The simplest way to reset is to change `COUNTER_KEY` in `app.js` to a new name.
A brand-new key starts at zero automatically:

```js
const COUNTER_BASE="https://abacus.jasoncameron.dev",
      COUNTER_NS="bitanyanmi-mlsa-dev-days",
      COUNTER_KEY="site-visits";   // <-- change this to reset
```

## Hiding the count from visitors

If you would rather the number were not public, delete the `<span id="visitCounter">…</span>`
element from the footer of `index.html` but keep the code in `app.js`. Visits will still be
recorded, and you can read the total any time using the `/get/` link above.

## A note on accuracy

This is a lightweight counter, not full analytics. It counts page visits per browser
session — it cannot tell you who visited, where they came from, or which pages they read.
If you later want that detail, free privacy-friendly options include
[GoatCounter](https://www.goatcounter.com) and
[Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/), both of which work
on GitHub Pages. You would need to add their domain to the
`connect-src`/`script-src` rules in the page's Content Security Policy.
