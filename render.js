/* =========================================================================
   AgenticAITrading.io — shared table/stat renderer
   -------------------------------------------------------------------------
   Reads window.SITE_DATA (from trades.js) and renders into the page based on
   window.VIEW_MODE:
     'T1' (default, main page)  -> Target 1 view. A trade is a WIN the moment
            it hits Target 1; only the Target 1 column is shown.
     'T2' (high-risk page)      -> Target 2 view (full current format with both
            Target 1 and Target 2 columns).
   Both pages provide these element IDs: stats-heading, stats, open-table,
   closed-table, watch-table, updated, yr.
   ========================================================================= */
(function () {
  var D = window.SITE_DATA || {};
  var T2 = (window.VIEW_MODE === 'T2');

  var fmt = function (n) {
    return (n === null || n === undefined || n === '') ? '—'
      : Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };
  var esc = function (s) { return String(s).replace(/[&<>]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]); }); };
  function dirBadge(d) { return '<span class="dir ' + esc(d) + '">' + esc(d) + '</span>'; }
  function tCell(v, h) { return fmt(v) + (h ? ' <span class="hit" title="Target hit">&#10003;</span>' : ''); }
  function pctTd(entry, exit, dir) {
    if (exit === null || exit === undefined || exit === '' || !entry) return '<td class="muted">—</td>';
    var r = (dir === 'SHORT' ? (entry - exit) / entry : (exit - entry) / entry) * 100;
    var c = r > 0 ? 'var(--green)' : (r < 0 ? 'var(--red)' : 'var(--muted)');
    return '<td style="font-weight:700;color:' + c + '">' + (r > 0 ? '+' : '') + r.toFixed(2) + '%</td>';
  }
  function md(dstr) { if (!dstr) return ''; var p = String(dstr).split('-'); return p.length === 3 ? (parseInt(p[1], 10) + '/' + parseInt(p[2], 10)) : dstr; }
  function byDateDesc(field) { return function (a, b) { return String(b[field] || '').localeCompare(String(a[field] || '')); }; }

  var openRaw = (D.trades || []).slice().sort(function (a, b) {
    var d = String(b.dateOpened || '').localeCompare(String(a.dateOpened || ''));
    return d !== 0 ? d : String(a.ticker || '').localeCompare(String(b.ticker || ''));
  });
  var closedRaw = (D.closedTrades || []);
  var watch = (D.watchlist || []).filter(function (w) { return w.state === 'ARMED'; });
  var closeMD = md(D.lastUpdated);

  function isNew(t) {
    if (t.isNew === true) return true;
    if (!D.lastUpdated || !t.dateOpened) return false;
    var diff = (new Date(D.lastUpdated) - new Date(t.dateOpened)) / 86400000;
    return diff >= 0 && diff <= 2;
  }

  // ---------- build mode-specific lists ----------
  var open, closed, wins, losses, heading;
  if (T2) {
    heading = 'Target 2';
    open = openRaw;
    closed = closedRaw.map(function (t) {
      return { ticker: t.ticker, direction: t.direction, dateOpened: t.dateOpened, dateClosed: t.dateClosed, entry: t.entry, exit: t.close, stop: t.stop, t1: t.t1, t2: t.t2, t1Hit: t.t1Hit, t2Hit: t.t2Hit, result: t.result };
    });
    wins = closed.filter(function (t) { return t.result === 'win'; }).length;
    losses = closed.filter(function (t) { return t.result === 'loss'; }).length;
  } else {
    heading = 'Target 1';
    var allT = openRaw.concat(closedRaw);
    // A trade is a Target-1 WIN the moment it hits T1 (whether still open in the T2 sense or fully closed)
    var t1Wins = allT.filter(function (t) { return t.t1Hit; }).map(function (t) {
      return { ticker: t.ticker, direction: t.direction, dateOpened: t.dateOpened, dateClosed: (t.t1Date || t.dateClosed || ''), entry: t.entry, exit: t.t1, stop: t.stop, t1: t.t1, t1Hit: true, result: 'win' };
    });
    // A Target-1 LOSS = stopped out before reaching T1
    var t1Losses = closedRaw.filter(function (t) { return t.result === 'loss' && !t.t1Hit; }).map(function (t) {
      return { ticker: t.ticker, direction: t.direction, dateOpened: t.dateOpened, dateClosed: t.dateClosed, entry: t.entry, exit: t.close, stop: t.stop, t1: t.t1, t1Hit: false, result: 'loss' };
    });
    closed = t1Wins.concat(t1Losses).sort(byDateDesc('dateClosed'));
    open = openRaw.filter(function (t) { return !t.t1Hit; });
    wins = t1Wins.length;
    losses = t1Losses.length;
  }
  var denom = wins + losses;
  var rate = denom ? Math.round((wins / denom) * 100) : 0;

  // ---------- stats ----------
  var sh = document.getElementById('stats-heading'); if (sh) sh.textContent = heading;
  var statsEl = document.getElementById('stats');
  if (statsEl) statsEl.innerHTML =
    '<div class="stat hero"><div class="num gold">' + rate + '%</div><div class="lbl">Success Rate</div></div>' +
    '<div class="stat"><div class="num">' + open.length + '</div><div class="lbl">Open Signals</div></div>' +
    '<div class="stat"><div class="num" style="color:var(--green)">' + wins + '</div><div class="lbl">Wins</div></div>' +
    '<div class="stat"><div class="num" style="color:var(--red)">' + losses + '</div><div class="lbl">Losses</div></div>';

  // ---------- OPEN ----------
  var openHead = '<tr><th>Trade</th><th>Date Opened</th><th>Entry</th><th>EOD Close (' + closeMD + ')</th><th>Stop</th><th>Target 1</th>' + (T2 ? '<th>Target 2</th>' : '') + '<th>Unrealized Gain/Loss</th></tr>';
  function openRow(t) {
    var nb = isNew(t) ? '<span class="new">NEW</span>' : '';
    return '<tr>' +
      '<td><span class="tkr">' + esc(t.ticker) + '</span>' + dirBadge(t.direction) + nb + '</td>' +
      '<td class="date">' + esc(t.dateOpened || '—') + '</td>' +
      '<td>' + fmt(t.entry) + '</td>' +
      '<td>' + fmt(t.close) + '</td>' +
      '<td>' + fmt(t.stop) + '</td>' +
      '<td>' + tCell(t.t1, t.t1Hit) + '</td>' +
      (T2 ? '<td>' + tCell(t.t2, t.t2Hit) + '</td>' : '') +
      pctTd(t.entry, t.close, t.direction) +
      '</tr>';
  }
  var openCols = T2 ? 8 : 7;
  var openTbl = document.getElementById('open-table');
  if (openTbl) openTbl.innerHTML = '<thead>' + openHead + '</thead><tbody>' +
    (open.length ? open.map(openRow).join('') : '<tr><td colspan="' + openCols + '" class="muted" style="text-align:center;padding:26px">No open trades right now.</td></tr>') + '</tbody>';

  // ---------- CLOSED ----------
  var closedHead = '<tr><th>Trade</th><th>Date Opened</th><th>Date Closed</th><th>Entry</th><th>Exit</th><th>Stop</th><th>Target 1</th>' + (T2 ? '<th>Target 2</th>' : '') + '<th>% Return</th><th>Result</th></tr>';
  function closedRow(t) {
    var res = t.result === 'win' ? '<td><span class="hit">Win &#10003;</span></td>' : '<td><span style="color:var(--red);font-weight:700">Loss &#10007;</span></td>';
    return '<tr>' +
      '<td><span class="tkr">' + esc(t.ticker) + '</span>' + dirBadge(t.direction) + '</td>' +
      '<td class="date">' + esc(t.dateOpened || '—') + '</td>' +
      '<td class="date">' + esc(t.dateClosed || '—') + '</td>' +
      '<td>' + fmt(t.entry) + '</td>' +
      '<td>' + fmt(t.exit) + '</td>' +
      '<td>' + fmt(t.stop) + '</td>' +
      '<td>' + tCell(t.t1, t.t1Hit) + '</td>' +
      (T2 ? '<td>' + tCell(t.t2, t.t2Hit) + '</td>' : '') +
      pctTd(t.entry, t.exit, t.direction) +
      res +
      '</tr>';
  }
  var closedCols = T2 ? 10 : 9;
  var closedTbl = document.getElementById('closed-table');
  if (closedTbl) closedTbl.innerHTML = '<thead>' + closedHead + '</thead><tbody>' +
    (closed.length ? closed.map(closedRow).join('') : '<tr><td colspan="' + closedCols + '" class="muted" style="text-align:center;padding:26px">No closed trades yet.</td></tr>') + '</tbody>';

  // ---------- WATCHLIST ----------
  var watchHead = '<tr><th>Ticker</th><th>Side / State</th><th>EOD Close (' + closeMD + ')</th><th>Trigger</th><th>Stop</th><th>Dist to Stop</th><th>Target 1</th>' + (T2 ? '<th>Target 2</th>' : '') + '</tr>';
  function watchRow(w) {
    var stateColor = w.state === 'ARMED' ? 'var(--muted)' : 'var(--green)';
    var stateTxt = w.state === 'ACTIVE' ? 'Active' : (w.state === 'T1_HIT' ? 'T1 Hit' : 'Armed');
    var dist = (w.close && w.stop) ? Math.abs((w.close - w.stop) / w.close * 100).toFixed(1) + '%' : '—';
    return '<tr>' +
      '<td><span class="tkr">' + esc(w.ticker) + '</span></td>' +
      '<td>' + dirBadge(w.side) + ' <span style="color:' + stateColor + ';font-weight:600">' + stateTxt + '</span></td>' +
      '<td>' + fmt(w.close) + '</td>' +
      '<td>' + fmt(w.level) + '</td>' +
      '<td>' + fmt(w.stop) + '</td>' +
      '<td>' + dist + '</td>' +
      '<td>' + fmt(w.t1) + '</td>' +
      (T2 ? '<td>' + fmt(w.t2) + '</td>' : '') +
      '</tr>';
  }
  var watchCols = T2 ? 8 : 7;
  var watchTbl = document.getElementById('watch-table');
  if (watchTbl) watchTbl.innerHTML = '<thead>' + watchHead + '</thead><tbody>' +
    (watch.length ? watch.map(watchRow).join('') : '<tr><td colspan="' + watchCols + '" class="muted" style="text-align:center;padding:26px">Watchlist unavailable.</td></tr>') + '</tbody>';

  var up = document.getElementById('updated'); if (up) up.textContent = 'Last updated: ' + (D.lastUpdated || '—') + '  ·  New setups are marked NEW.';
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
