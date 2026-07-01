/* =========================================================================
   AgenticAITrading.io — DATA FILE
   -------------------------------------------------------------------------
   Auto-generated from the watchlist EOD signal state. Each weekday at
   4:30 PM ET the scheduled task rewrites this file and pushes it.

   FIELDS PER TRADE:
     ticker, direction ("SHORT"/"LONG"), dateOpened ("YYYY-MM-DD"),
     entry, close (latest EOD close; for closed trades this is the exit price),
     stop, t1, t2, t1Hit / t2Hit (true once that target reached -> green check),
     t1Date (date Target 1 was reached; drives the Target 1 close on the main page),
     result: "open" (still active), "win" (closed at Target 2), "loss" (stopped out)

   Closed trades live in closedTrades[] and also carry dateClosed.
   Watchlist rows are validated: LONG shown only if close < trigger, SHORT only
   if close > trigger (armed-setup checkpoint).
   % Return is computed on the site (direction-aware):
     SHORT = (entry - close)/entry,  LONG = (close - entry)/entry.
   Model Success Rate = wins / (wins + losses) over closedTrades.
   ========================================================================= */

window.SITE_DATA = {
  lastUpdated: "2026-06-30",
  successRateOverride: null,
  trades: [
    { ticker: "GOOGL", direction: "SHORT", dateOpened: "2026-06-22", entry: 355.5, close: 357.37, stop: 366.5, t1: 340, t2: 328, t1Hit: true, t1Date: "2026-06-26", t2Hit: false, result: "open", isNew: false },
    { ticker: "NVDA", direction: "SHORT", dateOpened: "2026-06-24", entry: 199, close: 200.09, stop: 211.63, t1: 189, t2: 182, t1Hit: false, t2Hit: false, result: "open", isNew: false },
    { ticker: "META", direction: "SHORT", dateOpened: "2026-06-22", entry: 572.5, close: 563.29, stop: 593, t1: 547.5, t2: 536, t1Hit: true, t1Date: "2026-06-25", t2Hit: false, result: "open", isNew: false },
    { ticker: "AAPL", direction: "SHORT", dateOpened: "2026-06-25", entry: 287.3, close: 289.36, stop: 295.5, t1: 280, t2: 273, t1Hit: true, t1Date: "2026-06-25", t2Hit: false, result: "open", isNew: false },
    { ticker: "UNH", direction: "LONG", dateOpened: "2026-06-26", entry: 416.5, close: 415.63, stop: 389, t1: 430, t2: 445, t1Hit: false, t2Hit: false, result: "open", isNew: false },
    { ticker: "TLT", direction: "LONG", dateOpened: "2026-06-16", entry: 86.1, close: 86.42, stop: 84.3, t1: 87.7, t2: 89.2, t1Hit: false, t2Hit: false, result: "open", isNew: false }
  ],
  closedTrades: [
    { ticker: "MSFT", direction: "SHORT", dateOpened: "2026-06-16", dateClosed: "2026-06-22", entry: 397, close: 372, stop: 408.5, t1: 385, t2: 372, t1Hit: true, t1Date: "2026-06-17", t2Hit: true, result: "win" },
    { ticker: "NVDA", direction: "LONG", dateOpened: "2026-06-15", dateClosed: "2026-06-24", entry: 211.5, close: 198.87, stop: 198.87, t1: 228.34, t2: 245.18, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "META", direction: "SHORT", dateOpened: "2026-06-10", dateClosed: "2026-06-15", entry: 572.5, close: 593, stop: 593, t1: 547.5, t2: 536, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "AMZN", direction: "SHORT", dateOpened: "2026-06-25", dateClosed: "2026-06-29", entry: 231.5, close: 240, stop: 240, t1: 224, t2: 217, t1Hit: false, t2Hit: false, result: "loss" }
  ],
  watchlist: [
    { ticker: "MSFT", side: "LONG", state: "ARMED", close: 373.02, level: 417.5, stop: 405, t1: 432, t2: 450 },
    { ticker: "SPY", side: "LONG", state: "ARMED", close: 746.77, level: 748, stop: 733.5, t1: 760.4, t2: 773 },
    { ticker: "MU", side: "SHORT", state: "ARMED", close: 1154.29, level: 853, stop: 925, t1: 790, t2: 752 },
    { ticker: "WMT", side: "SHORT", state: "ARMED", close: 113.26, level: 112.5, stop: 116.5, t1: 108, t2: 105 },
    { ticker: "AMZN", side: "SHORT", state: "ARMED", close: 238.34, level: 231.5, stop: 240, t1: 224, t2: 217 },
    { ticker: "NFLX", side: "LONG", state: "ARMED", close: 71.4, level: 85.8, stop: 82.3, t1: 88.6, t2: 91.3 }
  ]
};
