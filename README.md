# Memphis — Listen. Feel. Create.

Music, reimagined. Memphis is a web application built to deliver a seamless, modern music listening experience. Users can create and manage personal playlists, explore fresh perspectives, and connect through sound.

---

### Features

* **Player**: A persistent, site-wide player that keeps playback running across navigation and highlights the current album or playlist.
* **Secure auth**: User registration and login with sessions managed through JSON Web Tokens (JWT).
* **Personal library**: A private page where logged-in users can view and manage their own playlists.
* **Protected admin dashboard**: Role-based, secure admin area for complete site management.

---

**Stack & Structure**

* **Backend (Routes, Controllers, Models, Middlewares):** Node.js, Express, MongoDB, Mongoose, Dotenv, CORS, JWT, Bcryptjs.
* **Frontend (React app with Components, Contexts, Hooks, Pages):** React, Vite, React Router DOM, Axios, FontAwesome.

---

**Code Style & Conventions**

* **JSX (React) & CSS Files:** Use `PascalCase` so the file name matches the component and its style file.

  * *Example:* `HomePage.jsx`, `Collection.jsx`, `HomePage.css`, `Collection.css`
* **JS Files:** Use `camelCase` for hooks, services, utils, and backend files.

  * *Example:* `usePlayer.js`, `collectionService.js`, `songController.js`

---

### Getting Started with Docker

The project is fully containerized with Docker, ensuring a consistent environment for both development and production.

**Prerequisites**

* [Docker](https://www.docker.com/products/docker-desktop/) installed and running.

**1. Environment Variables**
Create a local environment file by copying the example:

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

**Roadmap**

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