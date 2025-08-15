# Memphis - Listen. Feel. Create.

Music, reimagined. My goal is simple: turn passive listening into active discovery and make musical knowledge accessible to all. The approach combines clear musical mapping (instruments, keys, structure) with insights into streaming algorithms, alongside tools and guidance for anyone to create with intention and purpose

---

## Stack & Structure

* **Backend (Routes, Controllers, Models, Middlewares):** Node.js, Express, MongoDB, Mongoose, Dotenv, CORS, JWT, Bcryptjs

* **Frontend (React app with Components, Contexts, Hooks, Pages):** React, Vite, React Router DOM, Axios, FontAwesome

---

### Overview

* **`/`**: Displays featured playlists, albums, and recommended artists.
* **`/login`**: Allows existing users to sign in.
* **`/register`**: Allows new users to create an account.
* **`/search?q=`**: Shows results for songs, artists, and albums based on a query.
* **`/library`**: (Protected) Shows the current user's personal playlists.
* **`/admin`**: (Admin-only) A dashboard for managing users, songs, and albums.

* **`/artist/:id`**: Displays an artist's profile, top songs, and albums.
* **`/album/:id`**: Lists all the songs within a specific album.
* **`/playlist/:id`**: Lists all the songs within a specific playlist.

---

## Run

**1.  Set up environment variables** by copying the example (and fill in your secrets (e.g., `JWT_SECRET`, Spotify credentials)):

```bash
cp .env.example .env
```

**2. Running in Development Mode** (at `http://localhost:5173`. Changes trigger an automatic reload):

```bash
docker compose up --build
```

**3. Simulating Production Mode** (at `http://localhost:3000`):

```bash
docker compose -f docker-compose.yml up --build
```

**4. Stopping the Application:**

```bash
docker compose down
```

---

## Roadmap

Planned features for future Memphis versions:

* **Search**: Contextual search, including searching by lyrics within a specific playlist.
* **Filtering & Recommendations**: Filters and a recommendation system based on play counts and user activity.
* **Interactions**: Liking songs, following artists.
* **Shuffle modes**: More transparent shuffle logic with multiple user-configurable modes.
* **Library**: A reworked library for better organization and usability.
* **Sharing**: Easy sharing of songs, playlists, and more.
* **Page designs**: More personalized designs for Artist and Song pages.
* **Seamless auth flow**: Merge Login and Register into a single component with smooth transitions.
* **Theme customization**: Expanded light/dark modes and additional color palettes.
* **Responsiveness & Performance**: Ongoing improvements in responsiveness and loading speed.
* **Content**: Behind-the-scenes material, artist interviews, event coverage, and diaries.