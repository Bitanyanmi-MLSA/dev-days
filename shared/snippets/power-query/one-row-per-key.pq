// ---------------------------------------------------------------------------
// One row per key — before a table is allowed to be a dimension
// ---------------------------------------------------------------------------
// Geography, product and customer reference files almost never arrive at one
// row per key. Related as-is they force a many-to-many relationship, and every
// measure filtered through them is multiplied by however many rows that key
// happens to have. The tell: a total that goes UP when you add a slicer.
//
// Table.Distinct with a column list keeps the FIRST row per key. If which row
// you keep matters — a city name, a region owner, a price — group by the key
// and choose deliberately instead (second example below).
//
// See: /blog/three-joins-that-break-a-power-bi-model.html
// ---------------------------------------------------------------------------

let
    Source    = Csv.Document(
                    File.Contents( "C:\data\geolocation.csv" ),
                    [ Delimiter = ",", Encoding = 65001, QuoteStyle = QuoteStyle.Csv ]
                ),
    Headers   = Table.PromoteHeaders( Source, [ PromoteAllScalars = true ] ),
    Typed     = Table.TransformColumnTypes( Headers, {
                    { "geolocation_zip_code_prefix", Int64.Type },
                    { "geolocation_city",  type text },
                    { "geolocation_state", type text }
                } ),
    OnePerZip = Table.Distinct( Typed, { "geolocation_zip_code_prefix" } )
in
    OnePerZip

// ---------------------------------------------------------------------------
// Deliberate version: keep the most common city per zip prefix rather than
// whichever row happened to load first.
//
// let
//     Grouped = Table.Group(
//                   Typed,
//                   { "geolocation_zip_code_prefix" },
//                   {
//                       { "geolocation_city", each List.Mode( [geolocation_city] ), type text },
//                       { "geolocation_state", each List.Mode( [geolocation_state] ), type text }
//                   }
//               )
// in
//     Grouped
// ---------------------------------------------------------------------------
