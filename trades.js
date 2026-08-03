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
  lastUpdated: "2026-08-03",
  successRateOverride: null,

  trades: [
    { ticker: "NVDA", direction: "SHORT", dateOpened: "2026-07-27", entry: 199, close: 206.64, stop: 211.63, t1: 189, t2: 182, t1Hit: false, t2Hit: false, result: "open", isNew: false },
    { ticker: "WMT", direction: "SHORT", dateOpened: "2026-07-20", entry: 112.5, close: 110.71, stop: 116.5, t1: 108, t2: 105, t1Hit: false, t2Hit: false, result: "open", isNew: false },
    { ticker: "UNH", direction: "LONG", dateOpened: "2026-06-26", entry: 416.5, close: 415.36, stop: 389, t1: 430, t2: 445, t1Hit: true, t1Date: "2026-07-09", t2Hit: false, result: "open", isNew: false },
    { ticker: "MU", direction: "SHORT", dateOpened: "2026-07-31", entry: 853, close: 829.11, stop: 925, t1: 790, t2: 752, t1Hit: false, t2Hit: false, result: "open", isNew: true },
    { ticker: "TLT", direction: "SHORT", dateOpened: "2026-07-31", entry: 82.6, close: 82.19, stop: 84, t1: 80.7, t2: 79, t1Hit: false, t2Hit: false, result: "open", isNew: true },
  ],

  closedTrades: [
    { ticker: "MSFT", direction: "SHORT", dateOpened: "2026-06-16", dateClosed: "2026-06-22", entry: 397, close: 372, stop: 408.5, t1: 385, t2: 372, t1Hit: true, t1Date: "2026-06-17", t2Hit: true, result: "win" },
    { ticker: "NVDA", direction: "LONG", dateOpened: "2026-06-15", dateClosed: "2026-06-24", entry: 211.5, close: 198.87, stop: 198.87, t1: 228.34, t2: 245.18, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "META", direction: "SHORT", dateOpened: "2026-06-10", dateClosed: "2026-06-15", entry: 572.5, close: 593, stop: 593, t1: 547.5, t2: 536, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "AMZN", direction: "SHORT", dateOpened: "2026-06-25", dateClosed: "2026-06-29", entry: 231.5, close: 240, stop: 240, t1: 224, t2: 217, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "META", direction: "SHORT", dateOpened: "2026-06-22", dateClosed: "2026-07-01", entry: 572.5, close: 593, stop: 593, t1: 547.5, t2: 536, t1Hit: true, t1Date: "2026-06-25", t2Hit: false, result: "loss" },
    { ticker: "AAPL", direction: "SHORT", dateOpened: "2026-06-25", dateClosed: "2026-07-01", entry: 287.3, close: 295.5, stop: 295.5, t1: 280, t2: 273, t1Hit: true, t1Date: "2026-06-25", t2Hit: false, result: "loss" },
    { ticker: "META", direction: "LONG", dateOpened: "2026-07-01", dateClosed: "2026-07-02", entry: 612.5, close: 596, stop: 596, t1: 635, t2: 660, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "GOOGL", direction: "SHORT", dateOpened: "2026-06-22", dateClosed: "2026-07-06", entry: 355.5, close: 366.5, stop: 366.5, t1: 340, t2: 328, t1Hit: true, t1Date: "2026-06-26", t2Hit: false, result: "loss" },
    { ticker: "TLT", direction: "LONG", dateOpened: "2026-06-16", dateClosed: "2026-07-08", entry: 86.1, close: 84.3, stop: 84.3, t1: 87.7, t2: 89.2, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "META", direction: "LONG", dateOpened: "2026-07-07", dateClosed: "2026-07-09", entry: 612.5, close: 596, stop: 596, t1: 635, t2: 660, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "MU", direction: "LONG", dateOpened: "2026-07-09", dateClosed: "2026-07-13", entry: 990, close: 905, stop: 905, t1: 1060, t2: 1089, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "NVDA", direction: "SHORT", dateOpened: "2026-06-24", dateClosed: "2026-07-14", entry: 199, close: 211.63, stop: 211.63, t1: 189, t2: 182, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "GOOGL", direction: "SHORT", dateOpened: "2026-07-13", dateClosed: "2026-07-15", entry: 355.5, close: 366.5, stop: 366.5, t1: 340, t2: 328, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "AAPL", direction: "LONG", dateOpened: "2026-07-02", dateClosed: "2026-07-15", entry: 308.3, close: 324, stop: 297, t1: 317.4, t2: 324, t1Hit: true, t1Date: "2026-07-15", t2Hit: true, result: "win" },
    { ticker: "NVDA", direction: "LONG", dateOpened: "2026-07-14", dateClosed: "2026-07-17", entry: 211.5, close: 198.87, stop: 198.87, t1: 228.34, t2: 245.18, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "WMT", direction: "SHORT", dateOpened: "2026-07-01", dateClosed: "2026-07-17", entry: 112.5, close: 116.5, stop: 116.5, t1: 108, t2: 105, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "AMZN", direction: "LONG", dateOpened: "2026-07-15", dateClosed: "2026-07-17", entry: 254, close: 246.5, stop: 246.5, t1: 261, t2: 268.5, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "MU", direction: "SHORT", dateOpened: "2026-07-17", dateClosed: "2026-07-21", entry: 853, close: 925, stop: 925, t1: 790, t2: 752, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "GOOGL", direction: "SHORT", dateOpened: "2026-07-16", dateClosed: "2026-07-23", entry: 355.5, close: 328, stop: 366.5, t1: 340, t2: 328, t1Hit: true, t1Date: "2026-07-23", t2Hit: true, result: "win" },
    { ticker: "NVDA", direction: "LONG", dateOpened: "2026-07-22", dateClosed: "2026-07-27", entry: 211.5, close: 198.87, stop: 198.87, t1: 228.34, t2: 245.18, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "SPY", direction: "LONG", dateOpened: "2026-07-06", dateClosed: "2026-07-29", entry: 748, close: 733.5, stop: 733.5, t1: 760.4, t2: 773, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "MU", direction: "SHORT", dateOpened: "2026-07-28", dateClosed: "2026-07-29", entry: 853, close: 752, stop: 925, t1: 790, t2: 752, t1Hit: true, t1Date: "2026-07-29", t2Hit: true, result: "win" },
    { ticker: "MSFT", direction: "SHORT", dateOpened: "2026-07-06", dateClosed: "2026-07-30", entry: 397, close: 408.5, stop: 408.5, t1: 385, t2: 372, t1Hit: true, t1Date: "2026-07-08", t2Hit: false, result: "loss" },
    { ticker: "AMZN", direction: "SHORT", dateOpened: "2026-07-27", dateClosed: "2026-07-31", entry: 231.5, close: 240, stop: 240, t1: 224, t2: 217, t1Hit: false, t2Hit: false, result: "loss" },
  ],

  watchlist: [
    { ticker: "AAPL", side: "LONG", state: "ARMED", close: 303.42, level: 308.3, stop: 297, t1: 317.4, t2: 324 },
    { ticker: "META", side: "SHORT", state: "ARMED", close: 590.24, level: 572.5, stop: 593, t1: 547.5, t2: 536 },
    { ticker: "NFLX", side: "LONG", state: "ARMED", close: 73.33, level: 85.8, stop: 82.3, t1: 88.6, t2: 91.3 },
    { ticker: "MSFT", side: "SHORT", state: "ARMED", close: 487.65, level: 397, stop: 408.5, t1: 385, t2: 372 },
    { ticker: "AMZN", side: "SHORT", state: "ARMED", close: 284.02, level: 231.5, stop: 240, t1: 224, t2: 217 },
  ]
};
