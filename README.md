# Listen. Feel. Create.

My goal: turn passive listening into active discovery and make musical knowledge accessible to all. The approach combines clear musical mapping (instruments, keys, structure) with insights into streaming algorithms, alongside tools and guidance for anyone to create with intention and purpose

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