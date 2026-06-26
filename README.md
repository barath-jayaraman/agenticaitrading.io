# AgenticAITrading.io — Website

A self-contained static site. No build step, no server. You update **one file
(`trades.js`)** each day and push.

## Files
| File | What it is | Do you edit it? |
|------|-----------|-----------------|
| `index.html` | The whole site (layout, styles, render logic) | Rarely |
| `trades.js`  | **Your daily data** — trades, prices, results | **Yes, every day** |
| `logo.svg`   | Header logo (Diamond-AI gold) | No |
| `favicon.svg`| Browser-tab icon | No |
| `CNAME`      | Tells GitHub your custom domain is agenticaitrading.io | No |

---

## A. One-time setup — put it on GitHub Pages

1. Sign in to GitHub → **New repository**.
   - Name it exactly **`agenticaitrading.io`** (or anything; the name doesn't affect the domain).
   - Set it to **Public** (Pages is free for public repos). Create.
2. Click **Add file → Upload files**, drag in **all files from this folder**
   (`index.html`, `trades.js`, `logo.svg`, `favicon.svg`, `CNAME`), then **Commit**.
3. Repo → **Settings → Pages**:
   - **Source:** Deploy from a branch.
   - **Branch:** `main` / `(root)` → **Save**.
4. Wait ~1 minute. GitHub shows a green "Your site is live at
   `https://<username>.github.io/...`". Confirm it loads.

## B. Connect your domain (agenticaitrading.io)

You registered the domain, so add these DNS records at your registrar:

1. **Four A records** for the apex (`@`) pointing to GitHub Pages:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
2. One **CNAME record**: host `www` → value `<username>.github.io`.
3. In GitHub **Settings → Pages → Custom domain**, enter `agenticaitrading.io` → Save.
   (The included `CNAME` file already sets this.)
4. Tick **Enforce HTTPS** once it becomes available (can take up to a few hours).

> Tip: routing your DNS through **Cloudflare** (free) makes this faster and pairs
> perfectly with the analytics in step C.

## C. Private visitor analytics (your "admin screen")

We use **Cloudflare Web Analytics** — free, privacy-friendly, no cookie banner,
and the dashboard is visible **only to you** (login-protected).

1. Create a free account at **dash.cloudflare.com**.
2. Left menu → **Analytics & Logs → Web Analytics → Add a site**.
3. Enter `agenticaitrading.io`. Cloudflare gives you a snippet containing a
   **token** (a long string).
4. Open `index.html`, find the `CLOUDFLARE WEB ANALYTICS` block near the top,
   **uncomment** the `<script>` line and replace `YOUR_TOKEN_HERE` with your token.
5. Commit/upload the change. Your private dashboard (visitors, page views,
   countries, referrers) now lives at dash.cloudflare.com → Web Analytics.

> Why not a password-protected admin page on the site? On a static site any
> password lives in the browser and can be read by anyone — it's not secure.
> The Cloudflare dashboard is the proper private admin view.

---

## D. Daily update workflow (≈2 minutes)

Each evening, edit **`trades.js`** only:

1. Change `lastUpdated` to today (`"YYYY-MM-DD"`).
2. Update each open trade's **`close`** (latest price).
3. When a target is reached, set **`t1Hit: true`** / **`t2Hit: true`** (adds the ✅).
4. When a trade closes, set **`result`** to:
   - `"win"` — hit a target (counts toward success rate)
   - `"loss"` — stopped out (counts toward success rate)
   - `"open"` — still active
   - `"flat"` — breakeven/expired (excluded from rate)
   - Closed trades automatically move to the **Closed Trades — Results** table.
5. **New setups:** add a new `{ ... }` object. Set `dateOpened` to today — it gets a
   gold **NEW** badge automatically for 2 days, and shows the date opened.
6. Commit (GitHub: edit file → Commit). The live site updates in under a minute.

### Success rate
Calculated automatically as **wins ÷ (wins + losses)**; open/flat trades excluded.
To show a number from a longer history you track elsewhere, set
`successRateOverride: 78` (for 78%) in `trades.js`; set back to `null` to auto-calc.

---

## Required disclosures (already on the page)
- Top bar + footer: *"Disclaimer: Not an investment advice. For education purpose only."*
- Under the success rate + footer: *"Success rate is not a guarantee and past
  performance is not the reflection of future performance."*

## Email newsletter — automated daily send (Buttondown)

The site auto-builds a `feed.xml` from `trades.js`; Buttondown's RSS-to-email
sends each new day's email automatically. You change nothing in your routine.

**How it works**
- `build-feed.cjs` turns `trades.js` into a branded daily email + maintains `newsletter/items.json` (a 30-day archive) and writes `feed.xml`.
- `.github/workflows/daily-newsletter.yml` runs on every push that changes `trades.js`, regenerates the feed, and commits it back.
- Each day gets a unique GUID, so Buttondown sends **once per day** — re-pushing the same day does not resend.

**One-time setup**
1. Create a free account at **buttondown.com**, pick your username/newsletter handle.
2. In `index.html`, replace **both** instances of `YOUR_BUTTONDOWN_USERNAME` in the signup form with your actual Buttondown username, then commit.
3. In Buttondown, enable the **RSS-to-email** add-on (+$9/mo) and point it at your feed:
   `https://agenticaitrading.io/feed.xml` (or `https://barath-jayaraman.github.io/agenticaitrading.io/feed.xml` until the domain resolves).
4. (Optional) Configure send time / "send on new item" in Buttondown.
5. (Optional, +$29/mo) Add the **Automations** add-on if you want an automatic welcome email on signup.

**Daily routine** — unchanged: edit `trades.js`, commit. The Action rebuilds the feed; Buttondown sends the email.

**Cost:** free under 100 subscribers for the list/manual sends; automated send needs the +$9/mo RSS add-on (~$18/mo total at 500–1,000 subscribers).

## Want this on Squarespace instead?
Squarespace can host the brand/landing pages, but it can't natively run this
auto-calculating table + private analytics cleanly. The usual split is: keep this
site on GitHub Pages at agenticaitrading.io, and (optionally) link to it from a
Squarespace page. Tell me if you want that and I'll set it up.
