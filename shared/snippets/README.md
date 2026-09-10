# Snippets

Reusable DAX and Power Query (M) I actually use, pulled out of the case studies in
this repo so they can be copied into a model without opening a `.pbix`.

Every snippet is written against placeholder table and column names —
`Sales`, `'Date'`, `products[category]`. Change them to match your model; the
logic is the part worth keeping.

## DAX — [`dax/`](dax/)

| File | What it gives you |
|---|---|
| [`date-table.dax`](dax/date-table.dax) | A calculated date table built from the fact table's own range, so it can never be shorter than the data. |
| [`time-intelligence.dax`](dax/time-intelligence.dax) | Last year, year-over-year %, a 3-month rolling average, and a YTD that stops at the last date with data. |
| [`customer-grain.dax`](dax/customer-grain.dax) | Counting the person instead of the transaction record — and the repeat-purchase measures that only work once you do. |
| [`pareto-cumulative.dax`](dax/pareto-cumulative.dax) | The running total and cumulative % that turn "80% of revenue" into a line on the chart instead of a claim. |

## Power Query — [`power-query/`](power-query/)

| File | What it gives you |
|---|---|
| [`load-csv-utf8.pq`](power-query/load-csv-utf8.pq) | `Encoding = 65001` and `QuoteStyle.Csv` — the two settings that stop accents mojibaking and quoted line breaks splitting rows. |
| [`one-row-per-key.pq`](power-query/one-row-per-key.pq) | De-duplicating a reference table before it becomes a dimension, so it cannot inflate every aggregate through a many-to-many join. |
| [`normalise-text-key.pq`](power-query/normalise-text-key.pq) | Trim, clean and case-normalise a text key on both sides of a join, so rows stop landing in the blank row. |
| [`qa-key-check.pq`](power-query/qa-key-check.pq) | Row count against distinct business keys — the cheapest data-quality test there is. |
| [`fn-replace-restated-rows.pq`](power-query/fn-replace-restated-rows.pq) | Combine two extracts where the newer one restates rows of the older, instead of appending and double-counting the overlap. |

## Where they come from

- [Olist Retail Analytics](../../case-studies/olist-retail-analytics.html) — the modelling
  traps behind `customer-grain`, `one-row-per-key` and `load-csv-utf8`.
- [Ghana Regional Sales](../../case-studies/ghana-regional-sales.html) — the reconciliation
  behind `qa-key-check` and `fn-replace-restated-rows`.
- The [notes](../../blog/) walk through each one in context.

## Adding a snippet

1. Put it in `dax/` (`.dax`) or `power-query/` (`.pq`).
2. Open with a comment block: what it does, what breaks without it, what to rename,
   and when *not* to use it.
3. Add a row to the table above.
4. Only add code you have run in a real model.
