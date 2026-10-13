# Memphis

**Hear how it's made.** Memphis opens up songs. For each one you get the story of how it was recorded, a map of what plays when, and things to try yourself. It's for people who want to hear more in a song they love, and for people who make music.

The music stays wherever you listen. Memphis links out.

## Docs

- [Product](docs/product.md): the goal, who it's for, the song page, Unheard, the roadmap.
- [Listening roadmap](docs/listening-roadmap.md): what shipped, pilot criteria, and the next releases.
- [Technical](docs/technical.md): how the code is organised, the catalog file, the API.
- [User survey (Portuguese)](docs/research/pesquisa-usuarios-pt-br.md)

## Today

Three songs have interactive listening rooms and full reference pages: Dreams, bad guy and Running Up That Hill. Explore their arrangements, play an original sound sketch, and keep ideas in a device-local notebook without an account. Seven more songs have short reference pages. Unheard, a room for songs nobody is promoting, is open for submissions. The first Memphis interface is kept at `/design-archive`.

## Tech

Node.js, Express, MongoDB, Mongoose, JWT, React, React Router, Vite

-----

## Run

For the frontend showcase alone (no database required):

```bash
npm install --prefix frontend
npm run dev --prefix frontend
```

Open the printed local URL. Account features and Unheard submissions require the full stack below.


**1.  Set up environment variables** by copying the example (and fill in your secrets (e.g., `JWT_SECRET`, Spotify credentials)):

```bash
cp .env.example .env
```

**2. Running in development mode** (at `http://localhost:5173`. Changes trigger an automatic reload):

```bash
docker compose up --build
```

**3. Simulating production mode** (at `http://localhost:3000`):

```bash
docker compose -f docker-compose.yml up --build
```

**4. Running the tests:**

```bash
npm test --prefix backend
```

**5. Stopping the application:**

```bash
docker compose down
```