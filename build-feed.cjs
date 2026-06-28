/* =========================================================================
   AgenticAITrading.io - Newsletter feed builder
   -------------------------------------------------------------------------
   Reads trades.js, builds the branded daily email HTML, maintains a rolling
   archive (newsletter/items.json), and writes feed.xml at the repo root.
   Buttondown's RSS-to-email watches feed.xml and sends each new daily item.

   Run by GitHub Actions on every push that changes trades.js.
   No external dependencies - plain Node.
   ========================================================================= */

const fs = require('fs');

// --- load trades.js (it assigns window.SITE_DATA) ---
global.window = {};
eval(fs.readFileSync('trades.js', 'utf8'));
const D = global.window.SITE_DATA || {};
const date = D.lastUpdated || new Date().toISOString().slice(0, 10);

// --- data ---
const open = D.trades || [];
const closed = D.closedTrades || [];
const watch = D.watchlist || [];
const all = open.concat(closed);
const t1Succ = all.filter(t => t.t1Hit).length;
const t1Fail = all.filter(t => t.result === 'loss' && !t.t1Hit).length;
const t1Den = t1Succ + t1Fail;
const t1Rate = t1Den ? Math.round((t1Succ / t1Den) * 100) : 0;
const t2Succ = all.filter(t => t.t2Hit).length;
const t2Fail = all.filter(t => t.result === 'loss' && !t.t2Hit).length;
const t2Den = t2Succ + t2Fail;
const t2Rate = t2Den ? Math.round((t2Succ / t2Den) * 100) : 0;
const wins = closed.filter(t => t.result === 'win').length;
const losses = closed.filter(t => t.result === 'loss').length;

const dParts = String(date).split('-');
const md = dParts.length === 3 ? (parseInt(dParts[1], 10) + '/' + parseInt(dParts[2], 10)) : date;

// --- helpers ---
const fmt = n => (n === null || n === undefined || n === '')
  ? '&mdash;'
  : Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

const th = s => '<th style="text-align:left;padding:8px 10px;border-bottom:2px solid #d4af37;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.5px;">' + s + '</th>';
const td = s => '<td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:14px;color:#222;">' + s + '</td>';
const tHit = (v, h) => fmt(v) + (h ? ' &#9989;' : '');
const pctTd = t => {
  if (t.close === null || t.close === undefined || t.close === '' || !t.entry) return td('&mdash;');
  const r = (t.direction === 'SHORT' ? (t.entry - t.close) / t.entry : (t.close - t.entry) / t.entry) * 100;
  const col = r > 0 ? '#1a7f37' : (r < 0 ? '#c0392b' : '#888');
  return '<td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:14px;font-weight:700;color:' + col + ';">' + (r > 0 ? '+' : '') + r.toFixed(2) + '%</td>';
};

function rows(list, withResult) {
  const cols = withResult ? 10 : 8;
  if (!list.length) return '<tr><td colspan="' + cols + '" style="padding:14px;text-align:center;color:#999;font-size:14px;">None</td></tr>';
  return list.map(t => {
    let lead = td('<b>' + esc(t.ticker) + '</b> <span style="color:#888;font-size:12px;">' + esc(t.direction) + '</span>')
      + td(esc(t.dateOpened || '&mdash;'));
    if (withResult) lead += td(esc(t.dateClosed || '&mdash;'));
    let res = '';
    if (withResult) {
      const label = t.result === 'win' ? '&#9989; Win' : '&#10060; Loss';
      const col = t.result === 'win' ? '#1a7f37' : '#c0392b';
      res = '<td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:14px;font-weight:700;color:' + col + ';">' + label + '</td>';
    }
    return '<tr>' + lead
      + td(fmt(t.entry)) + td(fmt(t.close)) + td(fmt(t.stop))
      + td(tHit(t.t1, t.t1Hit)) + td(tHit(t.t2, t.t2Hit))
      + pctTd(t)
      + res + '</tr>';
  }).join('');
}

function watchRows() {
  if (!watch.length) return '<tr><td colspan="8" style="padding:14px;text-align:center;color:#999;font-size:14px;">Watchlist unavailable.</td></tr>';
  return watch.map(w => {
    const armed = w.state === 'ARMED';
    const stateTxt = w.state === 'ACTIVE' ? 'Active' : (w.state === 'T1_HIT' ? 'T1 Hit' : 'Armed');
    const stateColor = armed ? '#888' : '#1a7f37';
    const dist = (w.close && w.stop) ? Math.abs((w.close - w.stop) / w.close * 100).toFixed(1) + '%' : '&mdash;';
    const lvlTag = armed ? ' <span style="color:#888;font-size:11px">trig</span>' : '';
    return '<tr>'
      + td('<b>' + esc(w.ticker) + '</b>')
      + td('<span style="color:#888;font-size:12px;">' + esc(w.side) + '</span> <span style="color:' + stateColor + ';font-weight:600">' + stateTxt + '</span>')
      + td(fmt(w.close)) + td(fmt(w.level) + lvlTag) + td(fmt(w.stop)) + td(dist)
      + td(fmt(w.t1)) + td(fmt(w.t2)) + '</tr>';
  }).join('');
}

const html = [
  '<div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#111;">',
  '  <div style="background:#0b0b0e;padding:18px 20px;border-radius:10px 10px 0 0;">',
  '    <span style="font-size:22px;font-weight:800;color:#e9be48;">AgenticAITrading<span style="color:#cfe0ff;">.io</span></span>',
  '    <div style="color:#9aa0ac;font-size:13px;margin-top:2px;">EOD Target Alerts &mdash; ' + esc(date) + '</div>',
  '  </div>',
  '  <div style="border:1px solid #e5e5e5;border-top:none;border-radius:0 0 10px 10px;padding:18px 20px;">',
  '    <p style="font-size:15px;margin:0 0 4px;">Target 1 success rate: <b style="color:#1a7f37;">' + t1Rate + '%</b> (' + t1Succ + '/' + t1Den + ') &nbsp;&middot;&nbsp; Target 2 success rate: <b style="color:#1a7f37;">' + t2Rate + '%</b> (' + t2Succ + '/' + t2Den + ')</p>',
  '    <p style="font-size:14px;margin:0 0 12px;color:#444;">Open signals: <b>' + open.length + '</b> &nbsp;&middot;&nbsp; Wins: <b>' + wins + '</b> &nbsp;&middot;&nbsp; Losses: <b>' + losses + '</b></p>',
  '    <p style="font-size:12px;color:#888;font-style:italic;margin:0 0 18px;">Success rate is not a guarantee and past performance is not the reflection of future performance.</p>',

  '    <h3 style="font-size:16px;margin:0 0 8px;color:#111;">Open Trades</h3>',
  '    <table style="width:100%;border-collapse:collapse;margin-bottom:22px;">',
  '      <tr>' + th('Trade') + th('Opened') + th('Entry') + th('EOD Close (' + md + ')') + th('Stop') + th('Target 1') + th('Target 2') + th('% Return') + '</tr>',
  '      ' + rows(open, false),
  '    </table>',

  '    <h3 style="font-size:16px;margin:0 0 8px;color:#111;">Closed Trades &mdash; Results</h3>',
  '    <table style="width:100%;border-collapse:collapse;margin-bottom:22px;">',
  '      <tr>' + th('Trade') + th('Opened') + th('Closed') + th('Entry') + th('Exit') + th('Stop') + th('Target 1') + th('Target 2') + th('% Return') + th('Result') + '</tr>',
  '      ' + rows(closed, true),
  '    </table>',

  '    <h3 style="font-size:16px;margin:0 0 8px;color:#111;">Watchlist &mdash; All 13 Tickers</h3>',
  '    <p style="font-size:12px;color:#888;margin:0 0 8px;">ARMED = no position yet; the pending trigger is shown under Entry / Trigger.</p>',
  '    <table style="width:100%;border-collapse:collapse;margin-bottom:22px;">',
  '      <tr>' + th('Ticker') + th('Side / State') + th('EOD Close (' + md + ')') + th('Entry / Trigger') + th('Stop') + th('Dist to Stop') + th('Target 1') + th('Target 2') + '</tr>',
  '      ' + watchRows(),
  '    </table>',

  '    <div style="background:#faf6e9;border:1px solid #e7d9a8;border-radius:8px;padding:12px 14px;font-size:13px;color:#7a5d10;">',
  '      <b>Disclaimer:</b> Not an investment advice. For education purpose only.<br>',
  '      Success rate is not a guarantee and past performance is not the reflection of future performance.',
  '    </div>',
  '    <p style="font-size:12px;color:#999;margin-top:14px;">AgenticAITrading.io &nbsp;&middot;&nbsp; <a href="https://agenticaitrading.io" style="color:#b8860b;">agenticaitrading.io</a></p>',
  '  </div>',
  '</div>'
].join('\n');

// --- maintain rolling archive ---
let items = [];
try { items = JSON.parse(fs.readFileSync('newsletter/items.json', 'utf8')); } catch (e) { items = []; }

const title = 'EOD Target Alerts - ' + date;
const idx = items.findIndex(i => i.date === date);
const entry = { date: date, title: title, html: html };
if (idx >= 0) items[idx] = entry;   // same-day re-push: refresh content, keep guid (no resend)
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
  '      <pubDate>' + new Date(i.date + 'T21:10:00Z').toUTCString() + '</pubDate>',
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
console.log('feed.xml written: ' + items.length + ' item(s); latest = ' + date);
