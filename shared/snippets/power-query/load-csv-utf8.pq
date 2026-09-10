// ---------------------------------------------------------------------------
// Load a CSV as UTF-8
// ---------------------------------------------------------------------------
// Encoding = 65001 is UTF-8. Without it, accented and non-Latin characters
// mojibake on load — "ção" becomes something that will never match "ção"
// again, so joins on those keys silently fail and category labels become
// unreadable. Set it on every text source, not just the ones that look
// obviously non-English.
//
// QuoteStyle.Csv keeps line breaks inside quoted fields from splitting rows,
// which is what turns 100,000 clean rows into 100,412 broken ones.
// ---------------------------------------------------------------------------

let
    Source  = Csv.Document(
                  File.Contents( "C:\data\orders.csv" ),
                  [ Delimiter = ",", Encoding = 65001, QuoteStyle = QuoteStyle.Csv ]
              ),
    Headers = Table.PromoteHeaders( Source, [ PromoteAllScalars = true ] ),
    Typed   = Table.TransformColumnTypes( Headers, {
                  { "order_id",   type text },
                  { "order_date", type date },
                  { "amount",     type number }
              } )
in
    Typed
