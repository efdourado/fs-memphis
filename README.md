# Memphis

**Hear how it's made.** Memphis opens up songs. For each one you get the story of how it was recorded, a map of what plays when, and things to try yourself. It's for people who want to hear more in a song they love, and for people who make music.

The music stays wherever you listen. Memphis links out.

## Docs

- [Product](docs/product.md): the goal, who it's for, the song page, Unheard, the roadmap.
- [Technical](docs/technical.md): how the code is organised, the catalog file, the API.
- [User survey (Portuguese)](docs/research/pesquisa-usuarios-pt-br.md)

## Today

Three songs have full pages: Dreams, Bad Guy and Running Up That Hill. Seven more have short pages. Unheard, a room for songs nobody is promoting, is open for submissions. The first Memphis interface is kept at `/design-archive`.

## Tech

Node.js, Express, MongoDB, Mongoose, JWT, React, React Router, Vite

-----

## Run

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