# Memphis - Listen. Feel. Create.

Music, reimagined. My goal is simple: turn passive listening into active discovery and make musical knowledge accessible to all. The approach combines clear musical mapping (instruments, keys, structure) with insights into streaming algorithms, alongside tools and guidance for anyone to create with intention and purpose.

---

## Stack & Structure

* **Backend (Routes, Controllers, Models, Middlewares):** Node.js, Express, MongoDB, Mongoose, Dotenv, CORS, JWT, Bcryptjs.
* **Frontend (React app with Components, Contexts, Hooks, Pages):** React, Vite, React Router DOM, Axios, FontAwesome.

---

## Run

**1. Create a local environment file** by copying the example:

```bash
cp .env.example .env
```

Open `.env` and fill in your secrets (e.g., `JWT_SECRET`, Spotify credentials).

**2. Running in Development Mode**
Hot-reloading for both frontend and backend:

```bash
docker compose up --build
```

* Available at `http://localhost:5173`.
* Changes in `frontend` or `backend` trigger an automatic reload.

**3. Simulating Production Mode**
Build the optimized production image and run it locally:

```bash
docker compose -f docker-compose.yml up --build
```

* Available at `http://localhost:3000`.

**4. Stopping the Application**

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






