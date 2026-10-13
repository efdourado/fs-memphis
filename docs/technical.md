# Memphis — Technical

How the code is organised and how to change it. For what Memphis is, read [product.md](product.md).

## Stack

Node, Express, MongoDB and Mongoose on the backend. React, React Router, Vite and plain CSS on the frontend. Run instructions are in the [README](../README.md).

## Two parts of one app

| | Product | Design Archive |
| --- | --- | --- |
| What | The song pages and Unheard | The original Memphis: player, playlists, themes, Spotify playground, journal, first Atlas prototype, original sign-in |
| Frontend | `frontend/src/product/` | `frontend/src/pages/`, `frontend/src/components/` |
| Shell | `product/shell/AppShell.jsx` | `components/layout/LegacyShell.jsx` |
| Entry | `/` | `/design-archive` |

Both are routed in `frontend/src/App.jsx`. Archive pages load only when opened. Nothing in the archive is deleted; pages move there when the product stops using them.

## Design system

The product has its own stylesheet, `frontend/src/product/product.css`, scoped under `.p-app` with a `p-` prefix. It defines one warm dark theme and uses light and regular weights only, in sentence case. It does not reuse archive classes.

The archive keeps the original tokens in `frontend/src/styles/base.css` and its five theme presets.

Product songs use original generated vinyl artwork from `/covers/:slug.svg`, included in the frontend build. The archive retains the demo media API. People use the dragon (`public/fb.jpg`).

## Product routes

| Route | Page |
| --- | --- |
| `/` | Curated listening edition and three showcase rooms |
| `/listen/:slug` | Guided listening, arrangement explorer, sound sketch, takeaways |
| `/notebook` | Device-local techniques, reflections, progress and export |
| `/songs/:slug` | Song |
| `/unheard` | The Unheard room and the form to send a song |
| `/saved` | Saved songs, followed people, account |
| `/search` | Search |
| `/people/:slug` | Person |
| `/compare?a=&b=` | Two songs side by side |
| `/updates` | What's new |
| `/auth` | Log in or sign up |
| `/about` | Goal, roadmap, how to read a page, link to the archive |

## The catalog

The shelf is two files in `backend/src/data/`:

- `catalog.js` — every song: credits, dates, facts, sources, connections.
- `catalogDeep.js` — the full pages: idea, figures, making-of, glossary, map, moments, why it works, things to try, versions.

A song with an entry in `catalogDeep.js` is a full page; the rest are short. The server writes the catalog to MongoDB on every start, so the repository is the reviewed source of truth. To sync by hand:

```bash
npm run sync:catalog --prefix backend
```

Each claim has a `status`: `verified`, `editorial`, `computed` or `awaiting`. A `verified` claim needs a `sourceId` that points to one of the song's `sources`.

An arrangement map is a grid: `sections` across, one `layer` per instrument, and a cell per section (`0` silent, `1` quiet, `2` playing, `3` on the record but placement not documented).

```bash
npm test --prefix backend
```

The tests fail if a verified claim has no source, a credit names an unknown person, a connection points to a missing song, a full page is missing a block, or a map row does not match its sections.

Computed things (shared credits, connections, comparisons, which updates matter to a listener, checking a submission) are pure functions in `backend/src/services/catalogLogic.js`.

Songs sent from `/unheard` are stored in the `submissions` collection with status `new`. Nothing publishes them; an admin can read them at `GET /api/admin/unheard/submissions`.

## Frontend listening edition

`frontend/src/product/listening/edition.js` defines the three editorial sessions and the static public catalog adapter. `api.js` uses that adapter for public song, people, search and comparison reads. Existing authenticated operations and submissions still call the server.

`npm run sync:showcase --prefix frontend` generates `listening/catalog.json` and public covers from the backend's reviewed data and pure catalog helpers. `prebuild` runs it automatically. The production Docker builder includes the catalog source; standalone frontend containers without backend source validate and use the checked-in edition. Run it manually after catalog edits during local development. The generated snapshot is tracked so `npm run dev --prefix frontend` works on a fresh checkout without MongoDB. Catalog changes become public after a frontend rebuild; runtime-only database catalog edits are intentionally not reflected in this edition.

`NotebookContext.jsx` keeps saved technique IDs (`song-slug:index`), private notes and furthest session stage under the versioned `memphis-listening-notebook-v1` browser key. `notebook.js` validates restored data and discards invalid references. Storage failures show an export/copy warning. Stage 3 means the listener explicitly finished. Reordering techniques will require stable IDs or a notebook migration before the next catalog edition.

`SoundLab.jsx` uses native Web Audio with a short lookahead scheduler, four synthesized parts and explicit playback controls. It closes its audio context on unmount and when the document becomes hidden. It downloads no audio, uses no original-song material and does not autoplay. Its common 108 BPM sketch is separate from the song's actual tempo.

`listening/listening.css` contains the responsive edition and room styles. The arrangement is deliberately a visual, by-ear interpretation; unknown layer placement remains distinct from silence.

### Checks and local preview

```bash
npm run dev --prefix frontend
npm test --prefix frontend
npm test --prefix backend
npm run build --prefix frontend
```

The frontend tests cover session integrity, agreement with the reviewed catalog, search/compare behavior, missing entities and corrupted notebook data. Browser QA should cover: prompt reveal; changing arrangement section; start/stop and layer controls; stopping audio on navigation; saving/removing techniques; editing/reloading/exporting notes; completion and next room; mobile widths; direct links and browser Back.

## Backend flow

```text
Route → middleware / validator → controller → service → DAO or model
```

`container.js` wires dependencies. Routes are in `routes/api.js`.

## API

Base path `/api`. `auth` needs a user token.

**Product**

| Method | Path | Access |
| --- | --- | --- |
| GET | `/works`, `/works/:slug` | public |
| GET | `/people`, `/people/:slug` | public |
| GET | `/compare?a=&b=` | public |
| GET | `/catalog/search?q=` | public |
| GET | `/updates` | public; marks what is relevant when signed in |
| POST | `/unheard/submissions` | public |
| GET | `/admin/unheard/submissions` | admin |
| GET | `/me/library`, `/me/library/state` | auth |
| PUT / DELETE | `/me/library/saved/:slug` | auth |
| PUT / DELETE | `/me/library/following/:slug` | auth |
| POST | `/me/library/questions` | auth |
| DELETE | `/me/library/questions/:id` | auth |
| POST | `/me/updates/seen` | auth |
| GET | `/me/export` | auth |
| DELETE | `/me` | auth |

**Accounts**

| Method | Path | Access |
| --- | --- | --- |
| POST | `/auth/register`, `/auth/login` | public |
| GET | `/auth/me` | auth |
| GET | `/auth/spotify`, `/auth/spotify/callback` | public |

**Archive.** The original endpoints still serve the Design Archive: songs, albums, playlists, artists, users, posts, tags, podcasts, search, recommendations, shuffle, Spotify and listening sessions. See `routes/api.js` for the full list.

## Archive notes

- Artists are users with `isArtist`. `Song.artist` and `Album.artist` point to `User`. Splitting them is not worth the risk while the archive depends on it.
- Demo content for the archive comes from `npm run seed:demo --prefix backend` (set `SEED_LOCAL_DEMO=true`).
- Before any schema cleanup, export first: `npm run archive:legacy --prefix backend`. The export leaves out passwords and Spotify tokens.

Earlier plans and the listening-journal phase are in the git history of this folder.
