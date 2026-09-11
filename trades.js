/* =========================================================================
   AgenticAITrading.io — DATA FILE
   -------------------------------------------------------------------------
   FRESH START — 2026-09-11.

   The board was reset on this date. The complete prior track record (34 closed
   trades run on Model A levels dated 2026-06-10, T1 34% / T2 18%) is preserved
   in archive/performance-2026-06-10-to-2026-09-10.json and is no longer counted
   in the live success rate.

   Levels below are a fresh Model A read taken on the 2026-09-10 close. Every
   ticker carries a LONG and a SHORT side; the watchlist shows whichever side's
   trigger is nearer to price, per the tracker's armed-side checkpoint.

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
  lastUpdated: "2026-09-11",
  successRateOverride: null,

  trades: [
  ],

  closedTrades: [
  ],

  watchlist: [
    { ticker: "TLT", side: "SHORT", state: "ARMED", close: 80.78, level: 80.67, stop: 81.45, t1: 79.75, t2: 78.7 },
    { ticker: "SPY", side: "SHORT", state: "ARMED", close: 757.83, level: 756.64, stop: 761.2, t1: 751.57, t2: 743.66 },
    { ticker: "AMZN", side: "SHORT", state: "ARMED", close: 251.89, level: 249.58, stop: 256.3, t1: 239.82, t2: 232.79 },
    { ticker: "AAPL", side: "LONG", state: "ARMED", close: 326.57, level: 330.81, stop: 316.5, t1: 344.57, t2: 351.72 },
    { ticker: "MSFT", side: "SHORT", state: "ARMED", close: 492.44, level: 486, stop: 499.36, t1: 477.15, t2: 466.84 },
    { ticker: "GOOGL", side: "SHORT", state: "ARMED", close: 332.6, level: 327.74, stop: 338.7, t1: 315, t2: 300.6 },
    { ticker: "NFLX", side: "SHORT", state: "ARMED", close: 76.01, level: 74.67, stop: 77.8, t1: 72.18, t2: 70.55 },
    { ticker: "NVDA", side: "SHORT", state: "ARMED", close: 218.36, level: 213.6, stop: 221.6, t1: 205.3, t2: 195.44 },
    { ticker: "UNH", side: "SHORT", state: "ARMED", close: 388.28, level: 378.08, stop: 390.2, t1: 363.86, t2: 349.63 },
    { ticker: "META", side: "LONG", state: "ARMED", close: 644.38, level: 663.5, stop: 637.5, t1: 686.08, t2: 700.37 },
    { ticker: "WMT", side: "LONG", state: "ARMED", close: 105.73, level: 109.35, stop: 106.75, t1: 113.9, t2: 116.55 },
    { ticker: "MU", side: "SHORT", state: "ARMED", close: 977.41, level: 918.88, stop: 969.44, t1: 844.62, t2: 804 }
  ]
};
