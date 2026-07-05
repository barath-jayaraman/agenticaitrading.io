/* =========================================================================
   AgenticAITrading.io - Newsletter feed builder  (TARGET 1 view)
   -------------------------------------------------------------------------
   Reads trades.js, builds the branded daily email HTML, maintains a rolling
   archive (newsletter/items.json), and writes feed.xml at the repo root.
   Buttondown's RSS-to-email watches feed.xml and sends each new daily item.

   MOBILE-FIRST: the email uses a responsive CARD layout (one card per trade)
   instead of wide multi-column tables, so it reads cleanly on phones and
   desktop. No horizontal scrolling.

   The EMAIL shows the lower-risk TARGET 1 view only:
     - a trade is a WIN the moment it reaches Target 1 (closed at T1),
     - a LOSS if stopped out before reaching Target 1,
     - open = setups still working toward Target 1,
     - Target 2 lives on the website's "High risk high profit trades" page.

   Run by GitHub Actions on every push that changes trades.js.
   No external dependencies - plain Node.
   ========================================================================= */

const fs = require('fs');

// --- load trades.js (it assigns window.SITE_DATA) ---
global.window = {};
eval(fs.readFileSync('trades.js', 'utf8'));
const D = global.window.SITE_DATA || {};
const date = D.lastUpdated || new Date().toISOString().slice(0, 10);

// --- raw data ---
const openRaw = (D.trades || []).slice().sort((a, b) => {
  const d = String(b.dateOpened || '').localeCompare(String(a.dateOpened || ''));
  return d !== 0 ? d : String(a.ticker || '').localeCompare(String(b.ticker || ''));
});
const closedRaw = D.closedTrades || [];

// CHECKPOINT: a valid ARMED (waiting) setup must have price on the correct side
// of its trigger — LONG waits below the trigger, SHORT waits above it. Drop any
// row whose close has already passed the trigger (stale / wrong-sided level).
const armedValid = w => {
  if (w.level === null || w.level === undefined || w.close === null || w.close === undefined) return true;
  if (w.side === 'LONG')  return w.close < w.level && (w.t1 == null || w.t1 > w.level);
  if (w.side === 'SHORT') return w.close > w.level && (w.t1 == null || w.t1 < w.level);
  return true;
};
const watch = (D.watchlist || []).filter(w => w.state === 'ARMED' && armedValid(w));
const allT = openRaw.concat(closedRaw);

// --- Target 1 view ---
const t1Wins = allT.filter(t => t.t1Hit).map(t => ({
  ticker: t.ticker, direction: t.direction, dateOpened: t.dateOpened,
  dateClosed: (t.t1Date || t.dateClosed || ''), entry: t.entry, exit: t.t1,
  stop: t.stop, t1: t.t1, t1Hit: true, result: 'win'
}));
const t1Losses = closedRaw.filter(t => t.result === 'loss' && !t.t1Hit).map(t => ({
  ticker: t.ticker, direction: t.direction, dateOpened: t.dateOpened,
  dateClosed: t.dateClosed, entry: t.entry, exit: t.close,
  stop: t.stop, t1: t.t1, t1Hit: false, result: 'loss'
}));
const closed = t1Wins.concat(t1Losses)
  .sort((a, b) => String(b.dateClosed || '').localeCompare(String(a.dateClosed || '')));
const open = openRaw.filter(t => !t.t1Hit);

const wins = t1Wins.length;
const losses = t1Losses.length;
const rate = (wins + losses) ? Math.round((wins / (wins + losses)) * 100) : 0;

const dParts = String(date).split('-');
const md = dParts.length === 3 ? (parseInt(dParts[1], 10) + '/' + parseInt(dParts[2], 10)) : date;

// --- helpers ---
const fmt = n => (n === null || n === undefined || n === '')
  ? '&mdash;'
  : Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const tHit = (v, h) => fmt(v) + (h ? ' &#9989;' : '');

const badge = (txt, bg, fg) => '<span style="display:inline-block;font-size:11px;font-weight:700;padding:1px 7px;border-radius:5px;background:' + bg + ';color:' + fg + ';margin-left:6px;">' + txt + '</span>';
const dirBadge = d => d === 'SHORT' ? badge('SHORT', '#fdecea', '#c0392b') : badge('LONG', '#e7f6ec', '#1a7f37');
const newBadge = '<span style="display:inline-block;font-size:10px;font-weight:800;padding:1px 6px;border-radius:5px;background:#f5d76e;color:#5a4500;margin-left:6px;">NEW</span>';

// a wrapping "Label value" chip — this is what makes the card readable on mobile
const pair = (label, val) => '<span style="display:inline-block;margin:0 16px 5px 0;font-size:14px;color:#666;white-space:nowrap;">' + label + ' <b style="color:#111;">' + val + '</b></span>';

const pct = (entry, exit, dir) => {
  if (exit === null || exit === undefined || exit === '' || !entry) return '<span style="color:#888;">&mdash;</span>';
  const r = (dir === 'SHORT' ? (entry - exit) / entry : (exit - entry) / entry) * 100;
  const c = r > 0 ? '#1a7f37' : (r < 0 ? '#c0392b' : '#888');
  return '<span style="font-weight:700;color:' + c + ';">' + (r > 0 ? '+' : '') + r.toFixed(2) + '%</span>';
};

// One card. headerLeft = ticker+badges; headerRight = status/return (optional); body = wrapping chips.
function card(headerLeft, headerRight, body) {
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;margin:0 0 10px;">'
    + '<tr><td style="border:1px solid #e6e6e6;border-radius:10px;padding:12px 14px;background:#ffffff;">'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>'
    + '<td style="font-size:16px;color:#111;line-height:1.4;">' + headerLeft + '</td>'
    + (headerRight ? '<td style="text-align:right;font-size:14px;white-space:nowrap;vertical-align:top;padding-left:8px;">' + headerRight + '</td>' : '')
    + '</tr></table>'
    + (body ? '<div style="margin-top:8px;line-height:1.5;">' + body + '</div>' : '')
    + '</td></tr></table>';
}
const emptyCard = msg => '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px;"><tr><td style="border:1px solid #eee;border-radius:10px;padding:16px;text-align:center;color:#999;font-size:14px;">' + msg + '</td></tr></table>';

function openCards(list) {
  if (!list.length) return emptyCard('No open trades right now.');
  return list.map(t => {
    const hl = '<b>' + esc(t.ticker) + '</b>' + dirBadge(t.direction) + (t.isNew ? newBadge : '');
    const hr = pct(t.entry, t.close, t.direction) + '<div style="font-size:11px;color:#999;">unrealized</div>';
    const body = pair('Entry', fmt(t.entry)) + pair('Close (' + md + ')', fmt(t.close)) + pair('Stop', fmt(t.stop))
      + pair('Target 1', tHit(t.t1, t.t1Hit)) + pair('Opened', esc(t.dateOpened || '&mdash;'));
    return card(hl, hr, body);
  }).join('');
}

function closedCards(list) {
  if (!list.length) return emptyCard('No closed trades yet.');
  return list.map(t => {
    const win = t.result === 'win';
    const hl = '<b>' + esc(t.ticker) + '</b>' + dirBadge(t.direction);
    const hr = '<span style="font-weight:800;color:' + (win ? '#1a7f37' : '#c0392b') + ';">' + (win ? 'WIN &#9989;' : 'LOSS &#10060;') + '</span>';
    const body = pair('Entry', fmt(t.entry)) + pair('Exit', fmt(t.exit)) + pair('Stop', fmt(t.stop))
      + pair('Target 1', tHit(t.t1, t.t1Hit)) + pair('% Return', pct(t.entry, t.exit, t.direction))
      + pair('Opened', esc(t.dateOpened || '&mdash;')) + pair('Closed', esc(t.dateClosed || '&mdash;'));
    return card(hl, hr, body);
  }).join('');
}

function watchCards() {
  if (!watch.length) return emptyCard('Watchlist unavailable.');
  return watch.map(w => {
    const stateTxt = w.state === 'ACTIVE' ? 'Active' : (w.state === 'T1_HIT' ? 'T1 Hit' : 'Armed');
    const dist = (w.close && w.stop) ? Math.abs((w.close - w.stop) / w.close * 100).toFixed(1) + '%' : '&mdash;';
    const hl = '<b>' + esc(w.ticker) + '</b>' + dirBadge(w.side) + ' <span style="font-size:12px;color:#888;">' + stateTxt + '</span>';
    const body = pair('Close (' + md + ')', fmt(w.close)) + pair('Trigger', fmt(w.level)) + pair('Stop', fmt(w.stop))
      + pair('Dist to stop', dist) + pair('Target 1', fmt(w.t1));
    return card(hl, '', body);
  }).join('');
}

const html = [
  '<div style="background:#f4f5f7;padding:16px 0;">',
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">',
  '  <tr><td style="background:#0b0b0e;padding:18px 20px;">',
  '    <span style="font-size:22px;font-weight:800;color:#e9be48;">AgenticAITrading<span style="color:#cfe0ff;">.io</span></span>',
  '    <div style="color:#9aa0ac;font-size:13px;margin-top:2px;">EOD Target Alerts &mdash; ' + esc(date) + '</div>',
  '  </td></tr>',
  '  <tr><td style="padding:18px 16px 10px;">',
  '    <p style="font-size:15px;margin:0 0 6px;color:#111;"><b>Target 1</b> &mdash; Success rate <b style="color:#1a7f37;">' + rate + '%</b><br><span style="font-size:13px;color:#555;">' + wins + ' wins &middot; ' + losses + ' losses &middot; ' + open.length + ' open</span></p>',
  '    <p style="font-size:12px;color:#888;margin:0 0 4px;">Lower-risk <b>Target 1</b> view. Higher-risk version: <a href="https://agenticaitrading.io/highrisk.html" style="color:#b8860b;">High risk high profit trades</a>.</p>',
  '    <p style="font-size:11px;color:#999;font-style:italic;margin:0 0 8px;">Success rate is not a guarantee and past performance is not the reflection of future performance.</p>',

  '    <h3 style="font-size:15px;margin:16px 0 8px;color:#111;">Open Trades</h3>',
  '    ' + openCards(open),

  '    <h3 style="font-size:15px;margin:18px 0 8px;color:#111;">Closed Trades &mdash; Results</h3>',
  '    ' + closedCards(closed),

  '    <h3 style="font-size:15px;margin:18px 0 4px;color:#111;">Watchlist</h3>',
  '    <p style="font-size:12px;color:#888;margin:0 0 8px;">Tickers the model is watching with no position yet — the price that would start a trade is the Trigger.</p>',
  '    ' + watchCards(),

  '    <div style="background:#faf6e9;border:1px solid #e7d9a8;border-radius:8px;padding:12px 14px;font-size:12px;color:#7a5d10;margin-top:14px;">',
  '      <b>Disclaimer:</b> Not an investment advice. For education purpose only.<br>',
  '      Success rate is not a guarantee and past performance is not the reflection of future performance.',
  '    </div>',
  '    <p style="font-size:12px;color:#999;margin:12px 0 4px;">AgenticAITrading.io &nbsp;&middot;&nbsp; <a href="https://agenticaitrading.io" style="color:#b8860b;">agenticaitrading.io</a></p>',
  '  </td></tr>',
  '</table>',
  '</div>'
].join('\n');

// --- maintain rolling archive ---
let items = [];
try { items = JSON.parse(fs.readFileSync('newsletter/items.json', 'utf8')); } catch (e) { items = []; }

const title = 'EOD Target Alerts - ' + date;
const idx = items.findIndex(i => i.date === date);
const nowIso = new Date().toISOString();
const existing = idx >= 0 ? items[idx] : null;
// Store a real pubDate at first creation so the "every time" RSS cadence never
// sees a future timestamp; keep it stable on same-day re-pushes.
const pub = (existing && existing.pub) ? existing.pub : nowIso;
const entry = { date: date, title: title, pub: pub, html: html };
if (idx >= 0) items[idx] = entry;   // same-day re-push: refresh content, keep guid + pub (no resend)
else items.unshift(entry);          // new day: prepend (new guid -> Buttondown sends)
items = items.slice(0, 30);

fs.mkdirSync('newsletter', { recursive: true });
fs.writeFileSync('newsletter/items.json', JSON.stringify(items, null, 2));

// --- build RSS 2.0 ---
const escX = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const itemsXml = items.map(i => [
  '    <item>',
  '      <title>' + escX(i.title) + '</title>',
  '      <link>https://agenticaitrading.io</link>',
  '      <guid isPermaLink="false">agenticaitrading-' + i.date + '</guid>',
  '      <pubDate>' + new Date(i.pub || (i.date + 'T21:10:00Z')).toUTCString() + '</pubDate>',
  '      <description><![CDATA[' + i.html + ']]></description>',
  '      <content:encoded><![CDATA[' + i.html + ']]></content:encoded>',
  '    </item>'
].join('\n')).join('\n');

const rss = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
  '  <channel>',
  '    <title>AgenticAITrading.io - EOD Target Alerts</title>',
  '    <link>https://agenticaitrading.io</link>',
  '    <description>Daily end-of-day target alerts. Educational only. Not investment advice.</description>',
  '    <language>en-us</language>',
  '    <lastBuildDate>' + new Date().toUTCString() + '</lastBuildDate>',
  itemsXml,
  '  </channel>',
  '</rss>',
  ''
].join('\n');

fs.writeFileSync('feed.xml', rss);
console.log('feed.xml written: ' + items.length + ' item(s); latest = ' + date + '; T1 rate ' + rate + '% (' + wins + 'W/' + losses + 'L/' + open.length + 'open)');
