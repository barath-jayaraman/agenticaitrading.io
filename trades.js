/* =========================================================================
   AgenticAITrading.io — DATA FILE
   -------------------------------------------------------------------------
   Auto-generated from the watchlist EOD signal state. Each weekday at
   4:30 PM ET the scheduled task rewrites this file and pushes it.

   FIELDS PER TRADE:
     ticker, direction ("SHORT"/"LONG"), dateOpened ("YYYY-MM-DD"),
     entry, close (latest EOD close), stop, t1, t2,
     t1Hit / t2Hit (true once that target reached -> green check),
     result: "open" (still active), "win" (closed in profit), "loss" (stopped out)

   % Return is computed on the site (direction-aware):
     SHORT = (entry - close)/entry,  LONG = (close - entry)/entry.
   Model Success Rate = signals that reached >= Target 1 / (reached T1 + stopped).
   ========================================================================= */

window.SITE_DATA = {
  lastUpdated: "2026-06-26",
  successRateOverride: null,

  trades: [
    { ticker: "GOOGL", direction: "SHORT", dateOpened: "2026-06-22", entry: 355.50, close: 337.39, stop: 366.50, t1: 340,  t2: 328,  t1Hit: true,  t2Hit: false, result: "open" },
    { ticker: "NVDA",  direction: "SHORT", dateOpened: "2026-06-24", entry: 198.91, close: 192.53, stop: 211.63, t1: 189,  t2: 182,  t1Hit: false, t2Hit: false, result: "open" },
    { ticker: "MSFT",  direction: "SHORT", dateOpened: "2026-06-16", entry: 397.00, close: 372.97, stop: 408.50, t1: 385,  t2: 372,  t1Hit: true,  t2Hit: true,  result: "open" },
    { ticker: "META",  direction: "SHORT", dateOpened: "2026-06-22", entry: 572.50, close: 550.25, stop: 593.00, t1: 547.5,t2: 536,  t1Hit: true,  t2Hit: false, result: "open" },
    { ticker: "MU",    direction: "LONG",  dateOpened: "2026-06-15", entry: 990.00, close: 1132.33,stop: 905.00, t1: 1060, t2: 1089, t1Hit: true,  t2Hit: true,  result: "open" },
    { ticker: "AAPL",  direction: "SHORT", dateOpened: "2026-06-25", entry: 275.15, close: 283.78, stop: 295.50, t1: 280,  t2: 273,  t1Hit: false, t2Hit: false, result: "open" },
    { ticker: "UNH",   direction: "LONG",  dateOpened: "2026-06-26", entry: 427.89, close: 427.89, stop: 389.00, t1: 430,  t2: 445,  t1Hit: false, t2Hit: false, result: "open" },
    { ticker: "AMZN",  direction: "SHORT", dateOpened: "2026-06-25", entry: 227.01, close: 232.69, stop: 240.00, t1: 224,  t2: 217,  t1Hit: false, t2Hit: false, result: "open" },
    { ticker: "NFLX",  direction: "SHORT", dateOpened: "2026-06-16", entry: 80.90,  close: 73.81,  stop: 84.00,  t1: 77.8, t2: 74.9, t1Hit: true,  t2Hit: true,  result: "open" },
    { ticker: "TLT",   direction: "LONG",  dateOpened: "2026-06-16", entry: 86.10,  close: 87.36,  stop: 84.30,  t1: 87.7, t2: 89.2, t1Hit: false, t2Hit: false, result: "open" },
    { ticker: "TSLA",  direction: "SHORT", dateOpened: "2026-06-24", entry: 375.48, close: 379.71, stop: 408.00, t1: 350,  t2: 337,  t1Hit: false, t2Hit: false, result: "open" }
  ]
};
