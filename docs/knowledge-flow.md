# Knowledge Flow

Memphis turns passive listening into active discovery.

It does not replace the place where music plays. It connects the work, the people behind it and the context around it.

## Public prototype routes

- `/atlas` — works, people and connections
- `/atlas/song/die-young` — complete song dossier
- `/people/benny-blanco` — credits, roles and body of work
- `/genres/pop` — genre, scene and listening paths
- `/stories/pop-youth` — editorial context
- `/picks` — Memphis recommendations with reasons
- `/comparisons/breakthrough` — transparent, multifactor comparison
- `/technology/ai-and-art` — tools, process and provenance
- `/sources` — public editorial evidence ledger
- `/design-archive` — the original interface

These exact routes are the visual prototype. Dynamic `:slug` routes return when real entity data exists.

## Private navigation

- `/today`, `/journal`, `/patterns` — authenticated My Memphis space
- `/references` — the user's private reference shelf, never a public source ledger

## Discovery paths

```text
song -> sound or story -> full credit -> person -> other works
song -> connection -> genre or scene -> guided listening path
story -> context -> example works -> Memphis Pick
pick -> reason -> sequence -> external listening
```

Every detail page should open another useful direction. A song is a hub, not an endpoint.

## Song dossier

- Overview
- Story
- Sound and structure
- Complete credits
- Connections
- Sources

Audio and artwork are optional. The page must remain useful without either.

## Content status

- **Verified fact** — supported by a named source
- **Editorial reading** — Memphis interpretation, never presented as fact
- **Computed connection** — generated from visible criteria
- **Prototype / demo** — visual structure waiting for real data
- **Awaiting sources** — a deliberate empty state until evidence exists

The label stays close to the information it describes.

## Data boundaries

- No unlicensed audio or artwork.
- Link to external listening instead of copying a catalog.
- Keep credits and provenance attached to their sources.
- Describe listening patterns, not personality or mental health.
- Friend comparisons require mutual opt-in and show musical proximity only.
- Success comparisons are hypotheses with multiple factors, not causal verdicts.
- Users can inspect, correct, export and delete their personal data.

## Prototype first

The complete visual flow can ship before the catalog exists.

Prototype content proves hierarchy, navigation and component behavior. Real facts, credits, links and computed relationships only replace it after validation.

## Rule zero

No frontend deletion.

The original songs, albums, artists, playlists, player and components remain in the Memphis Design Archive. The knowledge layer grows beside them.
