/* =========================================================================
   AgenticAITrading.io — Newsletter feed builder
   -------------------------------------------------------------------------
   Reads trades.js, builds the branded daily email HTML, maintains a rolling
   archive (newsletter/items.json), and writes feed.xml at the repo root.
   Buttondown's RSS-to-email watches feed.xml and sends each new daily item.

   Run by GitHub Actions on every push that changes trades.js.
   No external dependencies — plain Node.
   ========================================================================= */

const fs = require('fs');

// --- load trades.js (it assigns window.SITE_DATA) ---
global.window = {};
eval(fs.readFileSync('trades.js', 'utf8'));
const D = global.window.SITE_DATA || { trades: [] };
const trades = D.trades || [];
const date = D.lastUpdated || new Date().toISOString().slice(0, 10);

// --- helpers ---
const fmt = n => (n === null || n === undefined || n === '')
  ? '&mdash;'
  : Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

const open = trades.filter(t => t.result === 'open');
const closed = trades.filter(t => t.result !== 'open');
const targetsHit = trades.filter(t => t.t1Hit).length;
const stopped = trades.filter(t => t.result === 'loss').length;
const denom = targetsHit + stopped;
const rate = (D.successRateOverride !== null && D.successRateOverride !== undefined)
  ? D.successRateOverride
  : (denom ? Math.round((targetsHit / denom) * 100) : 0);

const dParts = String(date).split('-');
const md = dParts.length === 3 ? (parseInt(dParts[1], 10) + '/' + parseInt(dParts[2], 10)) : date;

const th = s => `<th style="text-align:left;padding:8px 10px;border-bottom:2px solid #d4af37;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.5px;">${s}</th>`;
const td = s => `<td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:14px;color:#222;">${s}</td>`;
const tHit = (v, h) => fmt(v) + (h ? ' &#9989;' : '');
const pctTd = t => {
  if (t.close === null || t.close === undefined || t.close === '' || !t.entry) return td('&mdash;');
  const r = (t.direction === 'SHORT' ? (t.entry - t.close) / t.entry : (t.close - t.entry) / t.entry) * 100;
  const col = r > 0 ? '#1a7f37' : (r < 0 ? '#c0392b' : '#888');
  return `<td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:14px;font-weight:700;color:${col};">${(r > 0 ? '+' : '') + r.toFixed(2)}%</td>`;
};

function rows(list, withResult) {
  const cols = withResult ? 9 : 8;
  if (!list.length) return `<tr><td colspan="${cols}" style="padding:14px;text-align:center;color:#999;font-size:14px;">None</td></tr>`;
  return list.map(t => {
    let res = '';
    if (withResult) {
      const label = t.result === 'win' ? '&#9989; Win'
        : t.result === 'loss' ? '&#10060; Loss' : 'Flat';
      res = td(label);
    }
    return '<tr>'
      + td('<b>' + esc(t.ticker) + '</b> <span style="color:#888;font-size:12px;">' + esc(t.direction) + '</span>')
      + td(esc(t.dateOpened || '&mdash;'))
      + td(fmt(t.entry)) + td(fmt(t.close)) + td(fmt(t.stop))
      + td(tHit(t.t1, t.t1Hit)) + td(tHit(t.t2, t.t2Hit))
      + pctTd(t)
      + res + '</tr>';
  }).join('');
}

const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#111;">
  <div style="background:#0b0b0e;padding:18px 20px;border-radius:10px 10px 0 0;">
    <span style="font-size:22px;font-weight:800;color:#e9be48;">AgenticAITrading<span style="color:#cfe0ff;">.io</span></span>
    <div style="color:#9aa0ac;font-size:13px;margin-top:2px;">EOD Target Alerts &mdash; ${esc(date)}</div>
  </div>
  <div style="border:1px solid #e5e5e5;border-top:none;border-radius:0 0 10px 10px;padding:18px 20px;">
    <p style="font-size:15px;margin:0 0 12px;">Model success rate: <b style="color:#1a7f37;">${rate}%</b> &nbsp;&middot;&nbsp; Open signals: <b>${open.length}</b> &nbsp;&middot;&nbsp; Targets hit: <b>${targetsHit}</b> &nbsp;&middot;&nbsp; Stopped: <b>${stopped}</b></p>
    <p style="font-size:12px;color:#888;font-style:italic;margin:0 0 18px;">Success rate is not a guarantee and past performance is not the reflection of future performance.</p>

    <h3 style="font-size:16px;margin:0 0 8px;color:#111;">Open Trades</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:22px;">
      <tr>${th('Trade')}${th('Opened')}${th('Entry')}${th('EOD Close (' + md + ')')}${th('Stop')}${th('Target 1')}${th('Target 2')}${th('% Return')}</tr>
      ${rows(open, false)}
    </table>

    <h3 style="font-size:16px;margin:0 0 8px;color:#111;">Closed Trades &mdash; Results</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:22px;">
      <tr>${th('Trade')}${th('Opened')}${th('Entry')}${th('EOD Close (' + md + ')')}${th('Stop')}${th('Target 1')}${th('Target 2')}${th('% Return')}${th('Result')}</tr>
      ${rows(closed, true)}
    </table>

    <div style="background:#faf6e9;border:1px solid #e7d9a8;border-radius:8px;padding:12px 14px;font-size:13px;color:#7a5d10;">
      <b>Disclaimer:</b> Not an investment advice. For education purpose only.<br>
      Success rate is not a guarantee and past performance is not the reflection of future performance.
    </div>
    <p style="font-size:12px;color:#999;margin-top:14px;">AgenticAITrading.io &nbsp;&middot;&nbsp; <a href="https://agenticaitrading.io" style="color:#b8860b;">agenticaitrading.io</a></p>
  </div>
</div>`.trim();

// --- maintain rolling archive ---
let items = [];
try { items = JSON.parse(fs.readFileSync('newsletter/items.json', 'utf8')); } catch (e) { items = []; }

const title = `EOD Target Alerts — ${date}`;
const idx = items.findIndex(i => i.date === date);
const entry = { date, title, html };
if (idx >= 0) items[idx] = entry;      // same-day re-push: refresh content, keep guid (no resend)
else items.unshift(entry);             // new day: prepend (new guid -> Buttondown sends)
items = items.slice(0, 30);

fs.mkdirSync('newsletter', { recursive: true });
fs.writeFileSync('newsletter/items.json', JSON.stringify(items, null, 2));

// --- build RSS 2.0 ---
const escX = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const itemsXml = items.map(i => `    <item>
      <title>${escX(i.title)}</title>
      <link>https://agenticaitrading.io</link>
      <guid isPermaLink="false">agenticaitrading-${i.date}</guid>
      <pubDate>${new Date(i.date + 'T21:10:00Z').toUTCString()}</pubDate>
      <description><![CDATA[${i.html}]]></description>
      <content:encoded><![CDATA[${i.html}]]></content:encoded>
    </item>`).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>AgenticAITrading.io — EOD Target Alerts</title>
    <link>https://agenticaitrading.io</link>
    <description>Daily end-of-day target alerts. Educational only. Not investment advice.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>
`;
fs.writeFileSync('feed.xml', rss);
console.log(`feed.xml written: ${items.length} item(s); latest = ${date}`);
