# API

Base path: `/api`

`auth` requires a user token. `admin` requires an admin token.

## Auth and Spotify

| Method | Path | Access |
| --- | --- | --- |
| POST | `/auth/register` | public |
| POST | `/auth/login` | public |
| GET | `/auth/me` | auth |
| GET | `/auth/spotify` | public |
| GET | `/auth/spotify/callback` | public |
| GET | `/spotify/status` | auth |
| GET | `/spotify/search?q=` | auth |

## Discovery

| Method | Path | Access |
| --- | --- | --- |
| GET | `/search?q=` | public |
| GET | `/recommendations` | optional auth |
| GET | `/shuffle/songs` | optional auth |

## Listening

| Method | Path | Access |
| --- | --- | --- |
| GET / POST | `/sessions` | auth |
| GET / PUT / DELETE | `/session/:id` | owner or admin |
| GET | `/me/references` | auth |
| GET | `/me/listening-insights` | auth |
| GET | `/admin/listening-sessions` | admin |

## Artists and users

| Method | Path | Access |
| --- | --- | --- |
| GET | `/artists` | public |
| GET | `/artist/:id` | public |
| GET | `/artist/:artistId/albums` | public |
| POST / DELETE | `/artist/:artistId/follow` | auth |
| GET / POST | `/users` | admin |
| GET / PUT / DELETE | `/user/:id` | admin |
| GET | `/me/music-profile` | auth |
| GET | `/me/liked-songs` | auth |

## Music archive

| Method | Path | Access |
| --- | --- | --- |
| GET / POST | `/songs` | public / admin |
| GET / PUT / DELETE | `/song/:id` | public / admin |
| POST | `/song/:id/play` | optional auth |
| POST | `/song/:id/share` | public |
| POST | `/song/:songId/like` | auth |
| GET / POST | `/albums` | public / admin |
| GET / PUT / DELETE | `/album/:id` | public / admin |
| GET / POST | `/playlists` | public / auth |
| GET / PUT / DELETE | `/playlist/:id` | public / auth |
| GET | `/user/:ownerId/playlists` | public |
| GET | `/me/playlists` | auth |
| POST / DELETE | `/playlist/:id/song/:songId` | auth |

## Editorial

| Method | Path | Access |
| --- | --- | --- |
| GET / POST | `/posts` | public / admin |
| GET / PUT / DELETE | `/post/:slug` | public / admin |
| GET | `/admin/posts` | admin |
| GET | `/admin/post/:slug` | admin |
| GET / POST | `/tags` | public / admin |
| GET | `/tag/:slug` | public |
| GET / POST | `/podcasts` | public / admin |
| GET / PUT / DELETE | `/podcast/:id` | public / admin |

The current endpoints remain documented while the next domain is introduced.
