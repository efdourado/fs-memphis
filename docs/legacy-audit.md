# Legacy Audit

## Decision

The original music domain remains active as the Design Archive.

No legacy writes are frozen yet because Admin, playlists, likes and prototype playback still use them.

## Dependencies

- `Song.artist` points to `User`.
- `Album.artist` points to `User`.
- Artist pages depend on user virtuals for songs and albums.
- Playlists, likes and play events point to songs.
- Player, queue and discovery consume songs.

Splitting Artist now would create risk without improving the new listening domain.

## Artist decision

Artist remains a specialized user in this version.

Revisit only when archive editing no longer needs account fields.

## Safety

Run before any future legacy schema cleanup:

```bash
npm run archive:legacy --prefix backend
```

The export excludes passwords and Spotify tokens. Generated archives are not committed.
