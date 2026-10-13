# Memphis — Product

What Memphis is and where it goes. The visual version, with the approved page designs, is the [product brief](https://claude.ai/artifact/LRJ8Zmo8Fqpuqd64Zh1pgJ).

## The goal

**Hear how it's made.**

Memphis opens up songs. For each one you get the story of how it was recorded, a map of what plays when, and things to try yourself. Some are songs everyone knows. Some are by people nobody is promoting.

The music stays wherever you listen. Memphis links out.

## Where it came from

Memphis started as a music player built to fix what was frustrating about listening. The ambition grew past playback, toward understanding the music itself. That knowledge is scattered across credits, interviews, podcasts and theory sites. Memphis brings it into guided listening rooms, with a sourced reference page behind each song.

## Who it's for

| | Listener | Artist |
| --- | --- | --- |
| Question | "Why do I love this?" | "How was this made, and what can I use?" |
| Leaves with | Something new to hear on the next play | Techniques to try in their own song |

They read the same page. Neither needs to read music; studio terms are explained in a "plain words" box.

## The listening experience

The front door is a curated edition: **The art of less**. Three familiar songs become guided rooms with a listening prompt, an interactive arrangement, a song-specific original sound experiment and a takeaway to keep. The loop is **listen → explore → keep → follow the next idea**.

The notebook at `/notebook` works without an account, stores techniques, notes and session progress on this device, and exports to Markdown. The full song pages remain the source and reference layer. Public browsing ships as a static edition of the reviewed catalog; accounts and submissions retain the existing backend.

The **listening table** at `/connections` puts two original sound sketches side by side. Three curated pairings explore space, repetition and endings across the showcase songs. A listener chooses what draws them in, receives a specific next-listen prompt, and can keep the discovery with a private reflection. Saved connections can be replayed, edited, removed with Undo and exported from the notebook. These are editorial connections, not claims of influence or controlled comparisons of the recordings.

See the [implementation and next-release roadmap](listening-roadmap.md) for pilot criteria and the sequence of ideas to build next.

## The song page

A full page has, in order:

1. **The idea** — one sentence, and a few figures that carry the story.
2. **How it was made** — sourced steps, from writing to mix.
3. **What plays when** — a map of which instrument is in which section, plus moments to listen for.
4. **Why it works** — our reading of what the song is doing.
5. **Try it** — exercises a musician can do with their own material.
6. **Versions** — remixes, covers and live cuts, and what each changes.
7. **Who made it** — credits you can follow.
8. **Hear the same idea elsewhere** — connected songs, with the reason.

Three songs have the full page: Dreams, Bad Guy and Running Up That Hill. Seven more have short pages (what happened, what to listen for, credits) and say so.

## Unheard

Charts mostly measure marketing. Unheard is a room for songs nobody is promoting.

- **By craft.** A song gets in because someone can point to what's good about how it's made.
- **No numbers.** No charts, streams or follower counts on any Unheard page.
- **From the maker.** The artist tells how they made it, so the source is first-hand.
- **Found through technique.** A reader of a famous song's page is shown an Unheard song that uses the same idea.

The room is open and empty. Anyone can send a song from `/unheard`; nothing is published without the artist agreeing.

## Every line wears a tag

| Tag | Meaning |
| --- | --- |
| Fact | Backed by the source linked next to it. |
| Our take | How we hear it. An opinion. |
| Worked out | Calculated from other facts on the page. |
| Not documented | Left open on purpose. |

The arrangement maps are drawn by ear and labeled that way. The instruments on them are documented; where each one enters is our reading.

## The shelf

A known song gets in when its making is documented, there is one clear idea you can hear, and a musician can use it.

A page is finished when the making-of has sources, the map is drawn and says which parts are by ear, and gaps are named instead of guessed.

## What we can get

| What we need | Can we get it? | How |
| --- | --- | --- |
| Credits, studios, dates | Yes | MusicBrainz, Wikipedia, liner notes |
| Making-of stories | Yes, by hand | Interviews, memoirs, podcasts, magazines; summarised with a link |
| The arrangement map | Yes, by ear | Someone listens and draws it |
| Tempo and key | By hand | No open feed; Spotify's audio analysis is closed to new apps |
| Streams over time | No | Paid tools only, so the page doesn't show them |
| Lyrics, cover art, audio | No | Licensed; we link out and use generated covers |

Check each source's terms before depending on it.

## Design

One warm, dark listening environment with light typography, original vinyl artwork, moss and parchment accents, and a clear entry into each musical idea. The archive keeps its original designs. The main navigation is Discover, Unheard and Notebook, with Search beside it; saved songs and account management remain in the footer.

## Roadmap

**Now — A complete three-song listening loop.** Invite a small group to listen, explore, keep an idea and follow a connection. Measure understanding through observation before adding tracking.

**Next — Unheard bridges and listener validation.** Connect each showcase song to an independent artist through an audible technique. Test the three dedicated sound experiments with listeners and tune their sounds and prompts.

**Later — Artist-led rooms, optional notebook sync and new editions.** Add community only with moderation and enough listeners to make it useful.

The [detailed roadmap](listening-roadmap.md) sets scope and release gates for each stage.

## Open questions

- English or Portuguese? The app is in English; the [survey](research/pesquisa-usuarios-pt-br.md) is in Portuguese.
- Who researches and writes each page, and who reviews the maps?
- How are Unheard submissions reviewed? Today they are only stored.
