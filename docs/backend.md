# Backend

Node, Express, MongoDB and Mongoose.

## Flow

```text
Route
  → middleware / validator
  → controller
  → service
  → DAO
  → model
```

## Responsibilities

- Routes define the public contract.
- Middleware handles auth and errors.
- Validators protect input boundaries.
- Controllers translate HTTP requests and responses.
- Services hold business rules.
- DAOs isolate persistence operations.
- Models define stored data.
- `container.js` connects dependencies explicitly.

The separation lets the domain evolve without moving database logic into routes or UI decisions into services.

## Current domains

- Users and artists
- Songs and play events
- Albums and playlists
- Posts and tags
- Podcasts
- Search and discovery
- Spotify connection
- Listening sessions and external references
- Explainable personal insights

Listening sessions are private and owned by their user. Admin visibility is read-only in the interface.

The next version will add listening sessions and personal insight without deleting the original domains.
