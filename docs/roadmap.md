# Roadmap

## Rule zero

No frontend deletion.

Existing pages, components, styles and interactions stay available as the Memphis Design Archive.

We add, adapt, move or wrap. We do not erase.

## Product shape

Memphis becomes a companion for intentional listening.

Music can come from anywhere. Memphis stores the context, reflection and patterns around it.

## Pages

### New experience

- `/today` — quick listening check-in
- `/journal` — personal listening timeline
- `/session/:id` — one listening moment
- `/patterns` — habits, moods and insights
- `/references` — optional external music references

### Existing experience

- `/design-archive` — entry to the original interface
- Songs, albums, artists and playlists remain accessible
- Player remains available for prototype audio
- Memphis Archives remains the editorial space

### Admin

- People
- Artist Archive
- Music Archive
- Listening Sessions
- Editorial
- Tags

## Data direction

### ListeningSession

```text
user
occurredAt
durationMinutes
source
activity
moodBefore[]
moodAfter[]
location
socialContext
note
reference?
```

### ExternalReference

```text
title?
creator?
url?
service?
externalId?
```

No audio or artwork required.

### Insight

```text
user
period
type
summary
evidence
generatedAt
```

Insights must remain explainable from the user's own sessions.

## Existing data

`Song`, `Album`, `Playlist`, `PlayEvent` and artist-shaped users remain stable during the transition.

They become archive domains before any retirement decision.

## Refactor boundaries

- Separate archive services from the new listening domain.
- Keep API contracts stable while new endpoints are added.
- Make playback optional everywhere.
- Replace mandatory music relations with optional references only in new models.
- Split `Artist` from `User` only after archive pages no longer depend on that relation.
- Migrate data before changing or removing a field.

## Progress

### 0 — Foundation

- [x] Preserve the original direction in documentation
- [x] Document API and architecture
- [x] Remove the discarded light theme
- [x] Establish the no-deletion rule

### 1 — Archive framing

- [x] Add Artist Archive to Admin
- [x] Expose artist descriptions and curiosities
- [x] Turn song pages toward editorial information
- [x] Keep test audio optional
- [ ] Add the Design Archive entry page
- [ ] Mark prototype-only playback clearly across collections

### 2 — Listening domain

- [ ] Add `ListeningSession`
- [ ] Add optional `ExternalReference`
- [ ] Add session API and validation
- [ ] Add privacy and ownership rules
- [ ] Add Admin session visibility

### 3 — New experience

- [ ] Build Today
- [ ] Build Journal
- [ ] Build Session Detail
- [ ] Build Patterns
- [ ] Connect navigation without removing archive routes

### 4 — Insights

- [ ] Create explainable summaries
- [ ] Compare mood before and after listening
- [ ] Show activity and time patterns
- [ ] Let users inspect the evidence behind an insight

### 5 — Data review

- [ ] Measure which old relations are still used
- [ ] Decide whether Artist becomes independent from User
- [ ] Freeze unused legacy writes
- [ ] Archive data safely before any schema cleanup

Update this file as each slice ships.
