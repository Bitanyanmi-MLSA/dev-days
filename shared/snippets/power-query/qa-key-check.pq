// ---------------------------------------------------------------------------
// QA_KeyCheck — row count against distinct keys
// ---------------------------------------------------------------------------
// The cheapest data-quality test there is. It catches duplication that
// "Remove Duplicates" never will, because restated rows are not identical
// rows — they share a business key and differ in the values.
//
// Run it on each source query AND on the combined table. Duplicates should be
// zero on every refresh; if it is ever non-zero, the report is wrong before a
// single measure has been written.
//
// See: /blog/appending-two-extracts-is-a-decision.html
// ---------------------------------------------------------------------------

let
    KeyCols      = { "Region", "Period" },
    RowCount     = Table.RowCount( Sales ),
    DistinctKeys = Table.RowCount( Table.Distinct( Table.SelectColumns( Sales, KeyCols ) ) ),
    Result       = [
                       rows          = RowCount,
                       distinct_keys = DistinctKeys,
                       duplicates    = RowCount - DistinctKeys
                   ]
in
    Result

// ---------------------------------------------------------------------------
// To see WHICH keys duplicate rather than how many:
//
// let
//     Grouped    = Table.Group( Sales, { "Region", "Period" }, { { "rows", Table.RowCount, Int64.Type } } ),
//     Duplicated = Table.SelectRows( Grouped, each [rows] > 1 )
// in
//     Duplicated
// ---------------------------------------------------------------------------
