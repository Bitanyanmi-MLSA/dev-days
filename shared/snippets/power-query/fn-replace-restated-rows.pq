// ---------------------------------------------------------------------------
// fn_replace_restated_rows
// ---------------------------------------------------------------------------
// Combines two extracts where the newer one RESTATES some rows of the older
// one. Rows in `newer` win; rows in `older` survive only if their key is not
// present in `newer`.
//
// Use this instead of a plain append whenever two files overlap on the
// business key. Appending them double-counts the overlap, and because the
// duplicated rows are not identical, no duplicate-removal step will catch it.
// On a real regional extract this was the difference between the reported
// total and one 33% smaller.
//
// Only use it once the data owner has confirmed the overlap is a restatement.
// If both files are PARTIAL loads of the same period, the correct answer is to
// sum them, not to replace.
//
// Parameters
//   older  : table  — the earlier extract
//   newer  : table  — the later extract, whose values win
//   keys   : list   — business key columns, e.g. { "Region", "Period" }
//
// Usage
//   Sales = fn_replace_restated_rows( Sales_V1, Sales_V2, { "Region", "Period" } )
//
// Watch out
//   - Column names must match exactly. Table.Combine unions the column sets,
//     so one renamed column gives a half-null extra column instead of an error.
//   - JoinKind.LeftAnti keeps rows from the FIRST table with no match in the
//     second. Swap the arguments and you have decided the opposite version wins.
//
// See: /blog/appending-two-extracts-is-a-decision.html
// ---------------------------------------------------------------------------

( older as table, newer as table, keys as list ) as table =>
let
    NotRestated = Table.NestedJoin( older, keys, newer, keys, "restated", JoinKind.LeftAnti ),
    Cleaned     = Table.RemoveColumns( NotRestated, { "restated" } ),
    Combined    = Table.Combine( { Cleaned, newer } )
in
    Combined
