# New Country Attributes

Candidate fields to add to the `Country` type, in order of confidence.

| # | Field | Type | Confidence | Notes |
|---|-------|------|------------|-------|
| 1 | `landlocked` | `boolean` | 95% | 44 landlocked countries, well-documented |
| 2 | `island` | `boolean` | 92% | Island nations are a clear-cut set |
| 3 | `driveSide` | `"left" \| "right"` | 90% | Left-side = mostly former British colonies |
| 4 | `language` | `string` | 85% | Primary official language. Ambiguous for multilingual countries |
| 5 | `currencyCode` | `string` | 82% | ISO 4217. Uncertainty around dollarised/euroised economies |

## Priority

Start with `landlocked` + `island` — boolean, near-certain, and would make a natural new card face pairing.

## Card Face Ideas

- `landlocked` / `island` as a new face: "Geography" mode
- `language` as a face: "Language" mode
- `currencyCode` as a face: "Currency" mode

## Implementation Steps

1. Add fields to `Country` type in `src/data/countries.ts`
2. Populate data for all 197 countries
3. Add new `CardFace` values to `src/game/types.ts`
4. Update `getFaceValue()` to handle new faces
5. Cross-check data against a reference source before shipping
