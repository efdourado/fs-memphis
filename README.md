# Listen. Feel. Create.

Memphis helps curious listeners understand the music they love: its sound, the people behind it, and the ideas that connect it to other work. The goal is to turn listening into discovery, then give each person a path toward deeper understanding and creation.

Start with the [vision and goal](docs/direction.md), the [product roadmap](docs/product-roadmap.md), or the [full documentation](docs/index.md).

-----

## Tech

Node.js, Express, MongoDB, Mongoose, Dotenv, CORS, JWT, Bcryptjs, React, React Router DOM, FontAwesome

-----

## Endpoints

* `/`
* `/login`
* `/register`
* `/search?q=`
* `/library`
* `/admin`

* `/artist/:id`
* `/album/:id`
* `/playlist/:id`

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

**4. Stopping the application:**

```bash
docker compose down
```