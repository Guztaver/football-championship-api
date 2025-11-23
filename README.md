# Football Championship API

A complete CRUD API for managing football championships built with ElysiaJS, MongoDB, and Docker.

## 🚀 Features

- **Full CRUD Operations** for:
  - Teams
  - Players
  - Matches
  - Championships
  - Stadiums

- **Advanced Features**:
  - Automatic standings calculation
  - Player statistics tracking
  - Match filtering by date, team, and championship
  - Pagination support
  - Comprehensive API documentation with Swagger

## 📋 Requirements

- [Bun](https://bun.sh/) runtime
- [Docker](https://www.docker.com/) and Docker Compose
- MongoDB (via Docker)

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd football-championship-api
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

The default configuration:
```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017
MONGODB_DATABASE=football_championship
PORT=3000
NODE_ENV=development
```

### 4. Start MongoDB with Docker

```bash
docker-compose up -d
```

Verify MongoDB is running:
```bash
docker-compose ps
```

### 5. Start the API server

```bash
bun run dev
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:3000/swagger
```

## 🔗 API Endpoints

### Teams
- `POST /teams` - Create a new team
- `GET /teams` - List all teams (paginated)
- `GET /teams/:id` - Get team by ID
- `GET /teams/:id/players` - Get team with all players
- `PUT /teams/:id` - Update team
- `DELETE /teams/:id` - Delete team

### Players
- `POST /players` - Create a new player
- `GET /players` - List all players (paginated, filterable by team/position)
- `GET /players/:id` - Get player by ID
- `PUT /players/:id` - Update player
- `DELETE /players/:id` - Delete player

### Matches
- `POST /matches` - Schedule a new match
- `GET /matches` - List all matches (filterable by team, championship, date, status)
- `GET /matches/:id` - Get match by ID with team details
- `PUT /matches/:id` - Update match
- `PATCH /matches/:id/score` - Update match score
- `DELETE /matches/:id` - Delete match

### Championships
- `POST /championships` - Create a new championship
- `GET /championships` - List all championships (filterable by year)
- `GET /championships/:id` - Get championship by ID
- `GET /championships/:id/standings` - Get championship standings
- `POST /championships/:id/standings/recalculate` - Recalculate standings
- `PUT /championships/:id` - Update championship
- `DELETE /championships/:id` - Delete championship

### Stadiums
- `POST /stadiums` - Create a new stadium
- `GET /stadiums` - List all stadiums (paginated)
- `GET /stadiums/:id` - Get stadium by ID
- `PUT /stadiums/:id` - Update stadium
- `DELETE /stadiums/:id` - Delete stadium

## 📝 Example Usage

### Create a Team

```bash
curl -X POST http://localhost:3000/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "FC Barcelona",
    "founded": 1899,
    "city": "Barcelona",
    "country": "Spain",
    "coach": "Xavi Hernández"
  }'
```

### Create a Player

```bash
curl -X POST http://localhost:3000/players \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lionel Messi",
    "teamId": "your-team-id",
    "position": "Forward",
    "number": 10,
    "birthDate": "1987-06-24",
    "nationality": "Argentina"
  }'
```

### Schedule a Match

```bash
curl -X POST http://localhost:3000/matches \
  -H "Content-Type: application/json" \
  -d '{
    "homeTeamId": "team-id-1",
    "awayTeamId": "team-id-2",
    "championshipId": "championship-id",
    "date": "2024-12-25T20:00:00Z",
    "round": 1
  }'
```

### Update Match Score

```bash
curl -X PATCH http://localhost:3000/matches/match-id/score \
  -H "Content-Type: application/json" \
  -d '{
    "homeScore": 3,
    "awayScore": 1
  }'
```

## 🐳 Docker Commands

Start MongoDB:
```bash
bun run docker:up
# or
docker-compose up -d
```

Stop MongoDB:
```bash
bun run docker:down
# or
docker-compose down
```

View MongoDB logs:
```bash
bun run docker:logs
# or
docker-compose logs -f
```

## 🧪 Development

Run in development mode with hot reload:
```bash
bun run dev
```

Build for production:
```bash
bun run build
```

Run in production:
```bash
bun run start
```

## 🏗️ Project Structure

```
football-championship-api/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── models/
│   │   ├── team.model.ts        # Team model & repository
│   │   ├── player.model.ts      # Player model & repository
│   │   ├── match.model.ts       # Match model & repository
│   │   ├── championship.model.ts # Championship model & repository
│   │   └── stadium.model.ts     # Stadium model & repository
│   ├── routes/
│   │   ├── teams.routes.ts      # Team endpoints
│   │   ├── players.routes.ts    # Player endpoints
│   │   ├── matches.routes.ts    # Match endpoints
│   │   ├── championships.routes.ts # Championship endpoints
│   │   └── stadiums.routes.ts   # Stadium endpoints
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   └── index.ts                 # Main application entry
├── docker-compose.yml           # Docker configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 📊 Data Models

### Team
- name, logo, founded year, city, country, coach
- Relations: has many players, has one stadium

### Player
- name, position, number, birthDate, nationality, height, weight
- Statistics: goals, assists, yellow/red cards
- Relations: belongs to one team

### Match
- home/away teams, championship, date, scores, status, round, attendance
- Relations: belongs to championship, has two teams

### Championship
- name, year, start/end dates, teams, standings, status
- Automatically calculates standings based on match results

### Stadium
- name, capacity, city, country, address, inaugurated year, surface type

## 🌐 Deployment

### Vercel

This project is configured for deployment on Vercel using Serverless Functions.

#### Prerequisites
1. **MongoDB Atlas**: Since Vercel is serverless, you cannot use the local Docker MongoDB. You need a cloud-hosted MongoDB.
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a new cluster.
   - Create a database user.
   - Get the connection string (URI).

#### Deployment Steps

1. **Install Vercel CLI** (optional if deploying via Git):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Environment Variables**:
   When deploying, Vercel will ask for environment variables. You must provide:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority`)
   - `MONGODB_DATABASE`: Your database name (e.g., `football_championship`)

   You can also set these in the Vercel Dashboard under Settings > Environment Variables.

#### Note on Runtime
The project uses a custom adapter in `api/index.ts` to run ElysiaJS on Vercel's Node.js runtime. This ensures compatibility with Vercel's serverless environment while maintaining the developer experience of ElysiaJS.

## 📄 License

MIT

## 👨‍💻 Author

Built with ElysiaJS, MongoDB, and Docker for OAT2 - API Development Course
