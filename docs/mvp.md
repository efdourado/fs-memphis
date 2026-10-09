# Memphis MVP

The first complete version of the [product core](product-core.md): one repeatable song experience across a small collection, and the loop that brings a listener back.

**discover → understand → save or follow → receive a relevant update → explore again**

## The collection

Ten songs, chosen so each supports one full journey:

| Journey | Songs |
| --- | --- |
| An older song receiving renewed attention | Running Up That Hill, Dreams |
| A recent release, sustained vs. quick | Birds of a Feather, Espresso |
| Same writers, years apart | Bad Guy, Birds of a Feather |
| One writer across two decades | …Baby One More Time, Teenage Dream, Can't Feel My Face, Blinding Lights |
| What happens when the world changes | Die Young |

The collection lives in [`backend/src/data/catalog.js`](../backend/src/data/catalog.js). The server writes it to MongoDB on every start, so the repository stays the reviewed source of truth. To sync it manually, run `npm run sync:catalog` in `backend`.

## Content rules

Every claim has a status, shown next to it:

- **Verified**: a fact with a named source. Credits, dates, chart positions and documented production details were checked against Wikipedia on 2026-10-09.
- **Editorial**: a Memphis listening reading.
- **Computed**: derived by a method the page explains, such as shared credits or the attention pattern.
- **Demo data**: every attention curve. No trend data source has been verified yet.
- **Awaiting sources**: a deliberate gap, such as person biographies.

`npm test` in `backend` fails if a verified claim has no source, a credit names an unknown person, or an attention curve stops being labeled demo.

Listening links are search links (Spotify, Apple Music, YouTube), not hosted audio or hard-coded IDs.

## The song page

Each song answers the five questions in order:

1. **What changed?** The attention curve with dated pins, and a computed reading: renewed, sustained, short spike or settling.
2. **What might explain it?** Sourced events beside the timeline, with a reminder that timing is not cause.
3. **What can I hear?** A short guide for the next listen, then documented observations about the sound.
4. **What connects?** Credits you can follow, curated connections with reasons, and songs that share a credited person.
5. **What next?** Compare, open the next song, or keep a question.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Discover: the collection, journeys, latest updates, how to read labels |
| `/songs/:slug` | The song experience |
| `/people/:slug` | Credits and collaborators, computed from verified credits |
| `/compare?a=&b=` | Two songs on the same dimensions, shared people, both curves |
| `/search` | Songs and people, including credited names |
| `/updates` | What's new: updates about saved songs and followed people first |
| `/you` | Your library: saved songs, following, questions, data export and account deletion |
| `/auth`, `/about` | The original sign-in page, and how Memphis works |

The product uses the original Memphis design: the header with the wave logo, the five theme presets behind the palette icon, Rubik, the bronze gradient buttons, the dragon hero and avatars, and the generated vinyl artwork for songs. Original classes (`.header`, `.card`, `.carousel`, `.music-hero`, `.cta-button`, `.login-btn`) are reused; new styles live in `frontend/src/product/product.css` with a `p-` prefix.

There is one navigation. On desktop, Discover, What's new and Your library sit in the header next to search. On phones, the header keeps only the logo, theme and account, and the sections move to a floating dock (Discover, Search, New, Library, plus a back button on detail pages). The sidebar is gone from the product.

The original interface, the first Atlas prototype and the listening journal still render in their own chrome. They are listed on `/design-archive`; the original home moved to `/archive/home`.

## API

Public: `GET /api/works`, `/api/works/:slug`, `/api/people/:slug`, `/api/compare?a=&b=`, `/api/catalog/search?q=`, `/api/updates`. Signed-in requests to `/api/updates` also say which updates are relevant and which are new.

Signed in: `GET /api/me/library`, `GET /api/me/library/state`, `PUT|DELETE /api/me/library/saved/:slug`, `PUT|DELETE /api/me/library/following/:slug`, `POST /api/me/library/questions`, `DELETE /api/me/library/questions/:id`, `POST /api/me/updates/seen`, `GET /api/me/export`, `DELETE /api/me`.

## Still open

- **Trend data.** Choose one source, check its cost, update frequency and storage and display permissions, then replace demo curves song by song.
- **Updates.** They are written by hand in the catalog file. The weekly loop needs an editorial routine before any automation.
- **Biographies.** Person pages show credits only until sourced biographies exist.
- **Listener test.** Ask a few curious listeners to explore, return a week later and say what they learned. See [research](research/pesquisa-usuarios-pt-br.md).
