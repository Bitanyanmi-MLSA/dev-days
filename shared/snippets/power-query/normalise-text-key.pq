// ---------------------------------------------------------------------------
// Normalise a text key on both sides of a join
// ---------------------------------------------------------------------------
// A relationship can exist and still match nothing. Text keys fail for three
// boring reasons: a trailing space (invisible in the preview pane), a case
// difference (Power Query is case sensitive where the model is not), and a
// number stored as text on one side only.
//
// Apply this to the key column in BOTH queries before creating the
// relationship, then confirm no fact rows landed in the blank row.
//
// Text.Clean strips non-printable characters, Text.Trim strips leading and
// trailing whitespace, Text.Upper removes the case difference.
// ---------------------------------------------------------------------------

Table.TransformColumns(
    PreviousStep,
    { { "region_key", each Text.Upper( Text.Trim( Text.Clean( _ ) ) ), type text } }
)

// ---------------------------------------------------------------------------
// As a reusable function, for when several columns need the same treatment:
//
// ( source as table, columns as list ) as table =>
// let
//     Normalised =
//         Table.TransformColumns(
//             source,
//             List.Transform(
//                 columns,
//                 each { _, ( value ) => Text.Upper( Text.Trim( Text.Clean( value ?? "" ) ) ), type text }
//             )
//         )
// in
//     Normalised
// ---------------------------------------------------------------------------
