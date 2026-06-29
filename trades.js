/* =========================================================================
   AgenticAITrading.io — DATA FILE
   -------------------------------------------------------------------------
   Auto-generated from the watchlist EOD signal state. Each weekday at
   4:30 PM ET the scheduled task rewrites this file and pushes it.

   FIELDS PER TRADE:
     ticker, direction ("SHORT"/"LONG"), dateOpened ("YYYY-MM-DD"),
     entry, close (latest EOD close; for closed trades this is the exit price),
     stop, t1, t2, t1Hit / t2Hit (true once that target reached -> green check),
     result: "open" (still active), "win" (closed at Target 2), "loss" (stopped out)

   Closed trades live in closedTrades[] and also carry dateClosed.
   % Return is computed on the site (direction-aware):
     SHORT = (entry - close)/entry,  LONG = (close - entry)/entry.
   Model Success Rate = wins / (wins + losses) over closedTrades.
   ========================================================================= */

window.SITE_DATA = {
  lastUpdated: "2026-06-27",
  successRateOverride: null,

  trades: [
    { ticker: "GOOGL", direction: "SHORT", dateOpened: "2026-06-22", entry: 355.50, close: 337.39, stop: 366.50, t1: 340,   t2: 328,  t1Hit: true,  t2Hit: false, result: "open" },
    { ticker: "NVDA",  direction: "SHORT", dateOpened: "2026-06-24", entry: 199.00, close: 192.53, stop: 211.63, t1: 189,   t2: 182,  t1Hit: false, t2Hit: false, result: "open" },
    { ticker: "META",  direction: "SHORT", dateOpened: "2026-06-22", entry: 572.50, close: 550.25, stop: 593.00, t1: 547.5, t2: 536,  t1Hit: true,  t2Hit: false, result: "open" },
    { ticker: "AAPL",  direction: "SHORT", dateOpened: "2026-06-25", entry: 287.30, close: 283.78, stop: 295.50, t1: 280,   t2: 273,  t1Hit: true,  t2Hit: false, result: "open" },
    { ticker: "AMZN",  direction: "SHORT", dateOpened: "2026-06-25", entry: 231.50, close: 232.69, stop: 240.00, t1: 224,   t2: 217,  t1Hit: false, t2Hit: false, result: "open" },
    { ticker: "TLT",   direction: "LONG",  dateOpened: "2026-06-16", entry: 86.10,  close: 87.36,  stop: 84.30,  t1: 87.7,  t2: 89.2, t1Hit: false, t2Hit: false, result: "open" },
    { ticker: "TSLA",  direction: "SHORT", dateOpened: "2026-06-24", entry: 380.00, close: 379.71, stop: 408.00, t1: 350,   t2: 337,  t1Hit: false, t2Hit: false, result: "open" }
  ],

  /* Pending fill: triggered on the EOD close, entry order working the next session; NOT yet a
     position. Confirmed -> trades[] if the next session fills within 2% of the trigger, else voided. */
  pending: [
    { ticker: "UNH", direction: "LONG", dateOpened: "2026-06-26", entry: 416.50, stop: 389.00, t1: 430, t2: 445, status: "pending-fill", awaiting: "2026-06-29" }
  ],

  closedTrades: [
    { ticker: "MSFT", direction: "SHORT", dateOpened: "2026-06-16", dateClosed: "2026-06-22", entry: 397.00, close: 372.00,  stop: 408.50, t1: 385,    t2: 372,    t1Hit: true,  t2Hit: true,  result: "win" },
    { ticker: "NVDA", direction: "LONG",  dateOpened: "2026-06-15", dateClosed: "2026-06-24", entry: 211.50, close: 198.87,  stop: 198.87, t1: 228.34, t2: 245.18, t1Hit: false, t2Hit: false, result: "loss" },
    { ticker: "META", direction: "SHORT", dateOpened: "2026-06-10", dateClosed: "2026-06-15", entry: 572.50, close: 593.00,  stop: 593.00, t1: 547.5,  t2: 536,    t1Hit: false, t2Hit: false, result: "loss" }
  ],

  /* Voided by the 2% next-session fill-miss gate (price ran away from the trigger; never filled).
     Excluded from results. MU +3.03% (6/16 low 1020 vs trig 990), NFLX +3.04% (6/17 high 78.44 vs trig 80.9). */
  voidedSignals: [
    { ticker: "MU",   direction: "LONG",  triggerDate: "2026-06-15", entry: 990.00, miss: 0.0303, reason: "fill-miss > 2%" },
    { ticker: "NFLX", direction: "SHORT", triggerDate: "2026-06-16", entry: 80.90,  miss: 0.0304, reason: "fill-miss > 2%" }
  ],

  /* Watchlist = PENDING names only (no active or closed trade).
     Included only when neither side is open (both sides ARMED); re-armed names reappear here.
     side  = the nearer pending side.
     level = the pending trigger price. */
  watchlist: [
    { ticker: "MSFT", side: "SHORT", state: "ARMED", close: 372.97,  level: 397.00, stop: 408.50, t1: 385,  t2: 372 },
    { ticker: "SPY",  side: "SHORT", state: "ARMED", close: 728.99,  level: 719.00, stop: 733.50, t1: 705,  t2: 692 },
    { ticker: "MU",   side: "LONG",  state: "ARMED", close: 1132.33, level: 990.00, stop: 905.00, t1: 1060, t2: 1089 },
    { ticker: "WMT",  side: "SHORT", state: "ARMED", close: 115.69,  level: 112.50, stop: 116.50, t1: 108,  t2: 105 },
    { ticker: "NFLX", side: "SHORT", state: "ARMED", close: 73.81,   level: 80.90,  stop: 84.00,  t1: 77.8, t2: 74.9 }
  ]
};
