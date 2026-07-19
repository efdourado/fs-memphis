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
- [x] Add the Design Archive entry page
- [x] Mark prototype-only playback clearly across collections

### 2 — Listening domain

- [x] Add `ListeningSession`
- [x] Add optional `ExternalReference`
- [x] Add session API and validation
- [x] Add privacy and ownership rules
- [x] Add Admin session visibility

### 3 — New experience

- [x] Build Today
- [x] Build Journal
- [x] Build Session Detail
- [x] Build Patterns
- [x] Connect navigation without removing archive routes

### 4 — Insights

- [x] Create explainable summaries
- [x] Compare mood before and after listening
- [x] Show activity and time patterns
- [x] Let users inspect the evidence behind an insight

### 5 — Data review

- [x] Measure which old relations are still used
- [x] Decide whether Artist becomes independent from User
- [x] Decide whether legacy writes can be frozen
- [x] Add a safe export before any schema cleanup

Update this file as each slice ships.
