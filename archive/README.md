# Performance Archive

Signal ledgers from earlier eras of the AgenticAITrading.io board, preserved when the
public board is reset. Each era corresponds to one frozen set of Model A levels.

| Era | Levels dated | Period | Closed trades | T1 rate | T2 rate | File |
|-----|--------------|--------|--------------:|--------:|--------:|------|
| 1 | 2026-06-10 | 2026-06-10 → 2026-09-10 | 34 | 34% | 18% | [performance-2026-06-10-to-2026-09-10.json](performance-2026-06-10-to-2026-09-10.json) |

---

## Era 1 — Model A levels of 2026-06-10

**Archived 2026-09-11.** The board was reset to a fresh start on this date because the
2026-06-10 level table had drifted far from price: three signals in the final catch-up
were voided by the 2% fill gate because the trigger levels were no longer reachable.

### Headline

| Metric | Target 1 view | Target 2 view |
|--------|--------------:|--------------:|
| Success rate | **34%** | **18%** |
| Wins | 12 | 6 |
| Losses | 23 | 28 |
| Average return per closed trade | −1.71% | −2.44% |

Closed trades: **34**. Open at archive: **2** (META LONG, TLT SHORT).
Average win **+6.57%**, average loss **−4.38%** on the Target 2 basis.

The two views differ because the main site books a win the moment Target 1 is reached,
while the high-risk page requires Target 2. A trade can therefore be a T1 win and a T2
loss — UNH LONG (opened 2026-06-26) is the clearest example.

### By ticker (Target 2 basis)

| Ticker | Wins | Losses |
|--------|-----:|-------:|
| AAPL | 2 | 1 |
| MSFT | 1 | 1 |
| SPY | 1 | 1 |
| GOOGL | 1 | 3 |
| MU | 1 | 3 |
| TLT | 0 | 1 |
| WMT | 0 | 2 |
| AMZN | 0 | 3 |
| UNH | 0 | 3 |
| META | 0 | 5 |
| NVDA | 0 | 5 |

### What the record shows

- **Mean reversion against trend was the main loss driver.** NVDA and META went 0-for-10
  combined. Both were repeatedly shorted into strength and stopped out, and both
  long setups on NVDA were stopped at the same 198.87 level three separate times.
- **Repeat setups on the same stale level compounded losses.** MU short at 853 was
  taken four times; NVDA long at 211.5 three times. The level never moved, so the
  same trade was re-entered and re-stopped.
- **Wins were larger than losses** (+6.57% vs −4.38%), but too infrequent to carry the
  ledger — a 18% T2 hit rate needs roughly 5:1 payoff to break even.
- **Level staleness was the structural flaw.** Levels frozen on 2026-06-10 were still
  being used three months later against prices that had moved 10–25%.

### Contents of the JSON

- `summary` — the figures above
- `openAtArchive` — the 2 positions open when the board was reset
- `closedTrades` — all 34 closed trades with entry, exit, stop, both targets, dates and result
- `watchlistAtArchive` — the 9 armed setups at reset

Data is preserved exactly as published. Educational record only — not investment advice,
and past performance is not a reflection of future performance.
