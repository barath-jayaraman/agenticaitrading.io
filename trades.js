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
     lastUpdated: "2026-07-14",
     successRateOverride: null,
     trades: [
        { ticker: "GOOGL", direction: "SHORT", dateOpened: "2026-07-13", entry: 355.5, close: 359.51, stop: 366.5, t1: 340, t2: 328, t1Hit: false, t2Hit: false, result: "open", isNew: false },
        { ticker: "MSFT", direction: "SHORT", dateOpened: "2026-07-06", entry: 397, close: 384.93, stop: 408.5, t1: 385, t2: 372, t1Hit: true, t1Date: "2026-07-08", t2Hit: false, result: "open", isNew: false },
        { ticker: "SPY", direction: "LONG", dateOpened: "2026-07-06", entry: 748, close: 751.86, stop: 733.5, t1: 760.4, t2: 773, t1Hit: false, t2Hit: false, result: "open", isNew: false },
        { ticker: "AAPL", direction: "LONG", dateOpened: "2026-07-02", entry: 308.3, close: 314.86, stop: 297, t1: 317.4, t2: 324, t1Hit: false, t2Hit: false, result: "open", isNew: false },
        { ticker: "WMT", direction: "SHORT", dateOpened: "2026-07-01", entry: 112.5, close: 113.7, stop: 116.5, t1: 108, t2: 105, t1Hit: false, t2Hit: false, result: "open", isNew: false },
        { ticker: "UNH", direction: "LONG", dateOpened: "2026-06-26", entry: 416.5, close: 425.19, stop: 389, t1: 430, t2: 445, t1Hit: true, t1Date: "2026-07-09", t2Hit: false, result: "open", isNew: false }
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
        { ticker: "NVDA", direction: "SHORT", dateOpened: "2026-06-24", dateClosed: "2026-07-14", entry: 199, close: 211.63, stop: 211.63, t1: 189, t2: 182, t1Hit: false, t2Hit: false, result: "loss" }
          ],
     watchlist: [
        { ticker: "MU", side: "LONG", state: "ARMED", close: 983.12, level: 990, stop: 905, t1: 1060, t2: 1089 },
        { ticker: "AMZN", side: "LONG", state: "ARMED", close: 247.49, level: 254, stop: 246.5, t1: 261, t2: 268.5 },
        { ticker: "NFLX", side: "LONG", state: "ARMED", close: 73.53, level: 85.8, stop: 82.3, t1: 88.6, t2: 91.3 },
        { ticker: "TLT", side: "SHORT", state: "ARMED", close: 84.08, level: 82.6, stop: 84, t1: 80.7, t2: 79 },
        { ticker: "META", side: "SHORT", state: "ARMED", close: 661.04, level: 572.5, stop: 593, t1: 547.5, t2: 536 }
          ]
};
