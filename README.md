# Memphis — Listen. Feel. Create.

Music, reimagined — Memphis is a web application designed to provide a seamless, modern music listening experience. Users can build and manage personal playlists, and align new perspectives through sound.

---

**Features**

- **Player**: A persistent site-wide player that maintains playback across navigation and highlights the current album or playlist playing.
- **Secure auth**: Users can register and log in securely, with sessions managed by JSON Web Tokens (JWT).
- **Personal library**: Logged-in users have a private library page to view and manage their created playlists.

- **Protected admin dashboard**: A secure, role-protected admin area for complete site management.

---

**Stack & Structure**

- **Backend (Routes, Controllers, Models, Middlewares):** Node.js, Express, MongoDB, Mongoose, Dotenv, CORS, JWT, Bcryptjs;
- **Frontend (React app with Components, Contexts, Hooks, Pages):** React, Vite, React Router DOM, Axios, FontAwesome.

---

**Code Style & Conventions**

- **JSX (React) and CSS Files:** Use `PascalCase`. This ensures the file name matches the component's name and its associated style file.
  - *e.g.:* `HomePage.jsx`, `Collection.jsx`, `HomePage.css`, `Collection.css`

- **JS Files:** Use `camelCase`. This applies to hooks, services, utils, and backend files.
  - *e.g.:* `usePlayer.js`, `collectionService.js`, `songController.js`

---

**Run**

After cloning the repo:

1. **Install dependencies:**

```bash
npm install
```

2. **Set up backend environment variables:**

MONGODB_URI=
DB_NAME=
JWT_SECRET=

JWT_EXPIRES_IN=
PORT=

3. **Start front and backend server:**

```bash
npm run dev --prefix frontend
  
npm start --prefix backend
```

4. **Build for production:**

```bash
npm run build --prefix frontend
```

---

**Roadmap**

Here is a roadmap of features planned for future versions of Memphis:

- **Search**: Implement a contextual search (e.g., search by lyrics within a specific playlist);
- **Filtering & Recommendations**: Introduce filters and a recommendation system based on play counts and user activity.

- **Interactions**: Implement features like liking and following artists;
- **Shuffle modes**: Create a differential shuffle experience with transparency and multiple user-configurable options;
- **Library**: Overhaul the user's library for better organization and functionality;
- **Sharing**: Allow users to easily share their favorite songs, playlists, and etc.

- **Page designs**: Further customize key pages like Artist and Song;
- **Seamless auth flow**: Unify the Login and Register pages into a single, elegant component with a smooth transition;
- **Theme customization**: Enhance the existing light and dark modes and offer users more color palettes;
- **Responsiveness & Performance**: Continuously refine the app's responsiveness and optimize data loading.

- **Content**: Expand to include content like behind-the-scenes, artist interviews, events, and diaries.