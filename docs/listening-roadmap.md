# Memphis — From a song page to a listening club

## The product bet

Memphis should leave someone with a changed way of hearing, not just another page they read. Its unit is a **guided discovery**: a musical question, a listening assignment, something to explore, a takeaway, and a reason to open the next song.

The first edition is **The art of less**. Dreams, bad guy and Running Up That Hill connect through restraint: a repeating foundation, an empty space, a delayed release. These connections are editorial readings, not claims of influence between the artists.

Keep the full, sourced song pages as the reference layer. Let curiosity be the front door. A new visitor should get value before an account request.

## Shipped in this frontend edition

- A curated landing page with a switchable featured record, three room entries and a connected listening trail.
- `/listen/:slug`: three stages per showcase song—listen closer, pull it apart, make it yours. The selected stage is shareable in the URL.
- A prompt and reveal for each song, with original listening links and an explicit editorial point of view.
- A section-by-section arrangement explorer using the existing reviewed maps. Unknown placement is shown as unknown.
- An original four-part Web Audio sketch to try adding and removing layers. This is an educational exercise, not a reconstruction, original recording, stem player or automated analysis.
- A device-local notebook: keep techniques, write a private reflection, resume sessions, mark completion, revisit, remove saved ideas, export Markdown.
- A next-song handoff with an explicit musical reason, instead of an unrelated recommendation grid.
- Static public catalog and original artwork, generated from the existing catalog. The three rooms, notebook, public song pages, credits, search and comparisons need no running backend. Account services and Unheard submissions still do.

## Release gates for a small invited pilot

Before calling this a public MVP, test with 5–8 listeners and 3–5 people who make music. Use observation and conversation first; there is no analytics or tracking in this edition.

1. Can someone understand the offer and enter a room without an explanation?
2. Can they describe one thing they hear differently after the first session?
3. Do they explore a section or change the sound sketch without help?
4. Do they choose to keep an idea, write a note, or follow the next song?
5. Can they return to their notebook and find their takeaway?
6. Does the external music-app round trip interrupt the experience? Test on a real phone with headphones.

A useful pilot signal: most participants can explain a concrete discovery in their own words, and at least half voluntarily keep something or enter a second room. These are proposed gates, not measured results. Revisit the design if people enjoy the artwork but cannot explain what they gained.

## Next releases, in order

| Priority | Idea | What makes it worth building | Smallest credible release | Release gate |
| --- | --- | --- | --- | --- |
| 1 | Artist-to-listener bridges | The same technique connects an established record to an artist you have never heard | Three permissioned Unheard songs, one paired with each showcase room, with a first-person making-of | Every pairing has a specific audible reason and reviewed artist permission |
| 2 | A different experiment for each idea | People can feel an arrangement decision by changing it | A harmony/width exercise for Dreams, a riff-versus-voice exercise for bad guy, a machine-versus-played-accent exercise for Kate Bush, all using original sketches | Listeners can explain the difference without reading a tutorial |
| 3 | Artist-led rooms | The person who made the music can demonstrate a decision | One short, permissioned artist walkthrough with their own musical examples and one practical challenge | Clear rights, useful playback, captions, reviewed claims |
| 4 | A notebook that travels | Return visits retain accumulated taste across devices | Optional account sync, with explicit import of the existing local notebook and stable technique IDs | Nothing disappears during import; export and deletion are clear |
| 5 | New listening editions | A coherent reason to return, not endless catalog growth | One researched three-song edition around an idea such as imperfect voices, borrowed sounds, or endings | Every room has a clear discovery, an experiment and a meaningful next step |
| 6 | A shared listening table | Compare human interpretations without ranking popularity | Opt-in notes on one listening prompt, with moderation and no follower counts | A staffed review process and enough participants for useful conversation |

Do not build all six at once. Validate the first edition, then build the Unheard bridge and the distinct experiments. Those deepen the core promise before adding account and community overhead.

## Decisions still to make

- English, Brazilian Portuguese, or an explicit language choice? Test with the intended first audience.
- Who owns editorial review and the listening-map corrections?
- Who reviews submissions and obtains permission before an Unheard song is published?
- Should future original sketches become more musician-oriented, or stay understandable through listening alone?

## Limits of this edition

No full-song playback, licensed stems, exact-time sync, collaborative notes, remote notebook backup, personalized algorithm, submission moderation UI or publication automation. Browser storage can be cleared and is not shared between devices; export is available. Sources and factual claims are inherited from the existing reviewed catalog, not newly fact-checked in this design pass.
