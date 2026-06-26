/* =========================================================================
   AgenticAITrading.io — DAILY DATA FILE
   -------------------------------------------------------------------------
   This is the ONLY file you edit each day. Update "lastUpdated", then update
   each trade's "close" (current price), tick t1Hit/t2Hit when targets are hit,
   and set "result" when a trade closes.

   FIELDS PER TRADE:
     ticker      : symbol, e.g. "NVDA"
     direction   : "SHORT" or "LONG"
     dateOpened  : "YYYY-MM-DD"  (drives the NEW badge + Date Opened column)
     entry       : entry price (number)
     close       : current / latest close price (number) — update daily
     stop        : stop-loss price (number)
     t1          : target 1 price (number)
     t2          : target 2 price (number)
     t1Hit       : true once T1 is reached (shows a green check)
     t2Hit       : true once T2 is reached (shows a green check)
     result      : "open"  -> still active (counts in Open Trades)
                   "win"   -> closed in profit (hit a target)  -> counts toward success rate
                   "loss"  -> stopped out                      -> counts toward success rate
                   "flat"  -> closed at ~breakeven / expired    -> excluded from success rate

   SUCCESS RATE = wins / (wins + losses).  Open & flat trades are excluded.
   To override the auto number (e.g. you track a longer history elsewhere),
   set successRateOverride to a number like 78 (for 78%), else leave as null.
   ========================================================================= */

window.SITE_DATA = {
  lastUpdated: "2026-06-25",
  successRateOverride: null,

  trades: [
    { ticker: "GOOGL", direction: "SHORT", dateOpened: "2026-06-24", entry: 355.50, close: 343.71, stop: 366.50, t1: 340,  t2: 328,  t1Hit: false, t2Hit: false, result: "open" },
    { ticker: "NVDA",  direction: "SHORT", dateOpened: "2026-06-24", entry: 198.91, close: 195.74, stop: 211.63, t1: 189,  t2: 182,  t1Hit: false, t2Hit: false, result: "open" },
    { ticker: "MSFT",  direction: "SHORT", dateOpened: "2026-06-18", entry: 397.00, close: 352.83, stop: 408.50, t1: 385,  t2: 372,  t1Hit: true,  t2Hit: true,  result: "win"  },
    { ticker: "META",  direction: "SHORT", dateOpened: "2026-06-17", entry: 572.50, close: 542.87, stop: 593.00, t1: 547.5,t2: 536,  t1Hit: true,  t2Hit: false, result: "open" },
    { ticker: "MU",    direction: "LONG",  dateOpened: "2026-06-10", entry: 990.00, close: 1213.56,stop: 905.00, t1: 1060, t2: 1089, t1Hit: true,  t2Hit: true,  result: "win"  },
    { ticker: "AAPL",  direction: "SHORT", dateOpened: "2026-06-23", entry: 275.15, close: 275.15, stop: 295.50, t1: 280,  t2: 273,  t1Hit: false, t2Hit: false, result: "open" },
    { ticker: "AMZN",  direction: "SHORT", dateOpened: "2026-06-23", entry: 227.01, close: 227.01, stop: 240.00, t1: 224,  t2: 217,  t1Hit: false, t2Hit: false, result: "open" },
    { ticker: "NFLX",  direction: "SHORT", dateOpened: "2026-06-12", entry: 80.90,  close: 70.91,  stop: 84.00,  t1: 77.8, t2: 74.9, t1Hit: true,  t2Hit: true,  result: "win"  },
    { ticker: "TLT",   direction: "LONG",  dateOpened: "2026-06-19", entry: 86.10,  close: 87.35,  stop: 84.30,  t1: 87.7, t2: 89.2, t1Hit: false, t2Hit: false, result: "open" },
    { ticker: "TSLA",  direction: "SHORT", dateOpened: "2026-06-22", entry: 375.48, close: 375.12, stop: 408.00, t1: 350,  t2: 337,  t1Hit: false, t2Hit: false, result: "open" }
  ]
};
