# Listen. Feel. Create.

Memphis helps curious listeners understand the music they love: its sound, the people behind it, and the ideas that connect it to other work. The goal is to turn listening into discovery, then give each person a path toward deeper understanding and creation.

Start with the [vision and goal](docs/direction.md), the [product roadmap](docs/product-roadmap.md), or the [full documentation](docs/index.md).

-----

## What works today

A curated collection of ten songs, each answering five questions: what changed, what might explain it, what you can hear, what connects and what to do next. Listeners can save songs, follow the people in the credits, keep questions and get updates about what they follow. See the [MVP notes](docs/mvp.md).

The original interface is kept in the Design Archive at `/design-archive`.

-----

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