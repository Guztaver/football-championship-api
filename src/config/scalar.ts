export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Football Championship API',
    version: '1.0.0',
    description: 'Complete CRUD API for managing football championships, teams, players, matches, and stadiums',
  },
  servers: [
    {
      url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
      description: process.env.VERCEL_URL ? 'Production server' : 'Local development server',
    },
  ],
  tags: [
    { name: 'General', description: 'General API endpoints' },
    { name: 'Teams', description: 'Team management endpoints' },
    { name: 'Players', description: 'Player management endpoints' },
    { name: 'Matches', description: 'Match management endpoints' },
    { name: 'Championships', description: 'Championship management endpoints' },
    { name: 'Stadiums', description: 'Stadium management endpoints' },
  ],
  paths: {
    '/': {
      get: {
        tags: ['General'],
        summary: 'Health check',
        description: 'Check if the API is running and get basic information',
        responses: {
          '200': {
            description: 'API is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Football Championship API is running' },
                    version: { type: 'string', example: '1.0.0' },
                    documentation: { type: 'string', example: '/api-docs' },
                  },
                },
              },
            },
          },
        },
      },
    },
    // TEAMS ENDPOINTS
    '/teams': {
      get: {
        tags: ['Teams'],
        summary: 'List all teams',
        description: 'Retrieves a paginated list of all teams',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }, description: 'Items per page' },
        ],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Team' } },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Teams'],
        summary: 'Create a new team',
        description: 'Creates a new football team in the system',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTeamDto' } } },
        },
        responses: {
          '200': { description: 'Team created successfully' },
        },
      },
    },
    '/teams/{id}': {
      get: {
        tags: ['Teams'],
        summary: 'Get team by ID',
        description: 'Retrieves a specific team by its ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Team ID' }],
        responses: { '200': { description: 'Success' } },
      },
      put: {
        tags: ['Teams'],
        summary: 'Update team',
        description: 'Updates an existing team',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Team ID' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTeamDto' } } },
        },
        responses: { '200': { description: 'Team updated successfully' } },
      },
      delete: {
        tags: ['Teams'],
        summary: 'Delete team',
        description: 'Deletes a team from the system',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Team ID' }],
        responses: { '200': { description: 'Team deleted successfully' } },
      },
    },
    '/teams/{id}/players': {
      get: {
        tags: ['Teams'],
        summary: 'Get team with players',
        description: 'Retrieves a team with all its players',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Team ID' }],
        responses: { '200': { description: 'Success' } },
      },
    },
    // PLAYERS ENDPOINTS
    '/players': {
      get: {
        tags: ['Players'],
        summary: 'List all players',
        description: 'Retrieves a paginated list of players with optional filters',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }, description: 'Items per page' },
          { name: 'teamId', in: 'query', schema: { type: 'string' }, description: 'Filter by team ID' },
          { name: 'position', in: 'query', schema: { type: 'string' }, description: 'Filter by position' },
        ],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Player' } },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Players'],
        summary: 'Create a new player',
        description: 'Creates a new player and associates them with a team',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePlayerDto' } } },
        },
        responses: { '200': { description: 'Player created successfully' } },
      },
    },
    '/players/{id}': {
      get: {
        tags: ['Players'],
        summary: 'Get player by ID',
        description: 'Retrieves a specific player by their ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Player ID' }],
        responses: { '200': { description: 'Success' } },
      },
      put: {
        tags: ['Players'],
        summary: 'Update player',
        description: 'Updates an existing player including statistics',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Player ID' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdatePlayerDto' } } },
        },
        responses: { '200': { description: 'Player updated successfully' } },
      },
      delete: {
        tags: ['Players'],
        summary: 'Delete player',
        description: 'Deletes a player from the system',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Player ID' }],
        responses: { '200': { description: 'Player deleted successfully' } },
      },
    },
    // MATCHES ENDPOINTS
    '/matches': {
      get: {
        tags: ['Matches'],
        summary: 'List all matches',
        description: 'Retrieves a paginated list of matches with optional filters',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }, description: 'Items per page' },
          { name: 'teamId', in: 'query', schema: { type: 'string' }, description: 'Filter by team ID (home or away)' },
          { name: 'championshipId', in: 'query', schema: { type: 'string' }, description: 'Filter by championship ID' },
          { name: 'status', in: 'query', schema: { type: 'string' }, description: 'Filter by status' },
          { name: 'dateFrom', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Filter matches from this date' },
          { name: 'dateTo', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Filter matches to this date' },
        ],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Match' } },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Matches'],
        summary: 'Schedule a new match',
        description: 'Creates a new match between two teams in a championship',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateMatchDto' } } },
        },
        responses: { '200': { description: 'Match created successfully' } },
      },
    },
    '/matches/{id}': {
      get: {
        tags: ['Matches'],
        summary: 'Get match by ID',
        description: 'Retrieves a specific match with team details',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Match ID' }],
        responses: { '200': { description: 'Success' } },
      },
      put: {
        tags: ['Matches'],
        summary: 'Update match',
        description: 'Updates match details including scores and status',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Match ID' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateMatchDto' } } },
        },
        responses: { '200': { description: 'Match updated successfully' } },
      },
      delete: {
        tags: ['Matches'],
        summary: 'Delete match',
        description: 'Deletes a match from the system',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Match ID' }],
        responses: { '200': { description: 'Match deleted successfully' } },
      },
    },
    '/matches/{id}/score': {
      patch: {
        tags: ['Matches'],
        summary: 'Update match score',
        description: 'Updates the final score of a match and sets it to finished',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Match ID' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['homeScore', 'awayScore'],
                properties: {
                  homeScore: { type: 'number', minimum: 0, description: 'Home team score' },
                  awayScore: { type: 'number', minimum: 0, description: 'Away team score' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Match score updated successfully' } },
      },
    },
    // CHAMPIONSHIPS ENDPOINTS
    '/championships': {
      get: {
        tags: ['Championships'],
        summary: 'List all championships',
        description: 'Retrieves a paginated list of championships with optional year filter',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }, description: 'Items per page' },
          { name: 'year', in: 'query', schema: { type: 'integer', minimum: 1900 }, description: 'Filter by year' },
        ],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Championship' } },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Championships'],
        summary: 'Create a new championship',
        description: 'Creates a new championship with participating teams',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateChampionshipDto' } } },
        },
        responses: { '200': { description: 'Championship created successfully' } },
      },
    },
    '/championships/{id}': {
      get: {
        tags: ['Championships'],
        summary: 'Get championship by ID',
        description: 'Retrieves a specific championship by its ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Championship ID' }],
        responses: { '200': { description: 'Success' } },
      },
      put: {
        tags: ['Championships'],
        summary: 'Update championship',
        description: 'Updates an existing championship',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Championship ID' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateChampionshipDto' } } },
        },
        responses: { '200': { description: 'Championship updated successfully' } },
      },
      delete: {
        tags: ['Championships'],
        summary: 'Delete championship',
        description: 'Deletes a championship from the system',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Championship ID' }],
        responses: { '200': { description: 'Championship deleted successfully' } },
      },
    },
    '/championships/{id}/standings': {
      get: {
        tags: ['Championships'],
        summary: 'Get championship standings',
        description: 'Retrieves the current standings table for a championship with team details',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Championship ID' }],
        responses: { '200': { description: 'Success' } },
      },
    },
    '/championships/{id}/standings/recalculate': {
      post: {
        tags: ['Championships'],
        summary: 'Recalculate standings',
        description: 'Manually triggers standings recalculation based on match results',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Championship ID' }],
        responses: { '200': { description: 'Standings recalculated successfully' } },
      },
    },
    // STADIUMS ENDPOINTS
    '/stadiums': {
      get: {
        tags: ['Stadiums'],
        summary: 'List all stadiums',
        description: 'Retrieves a paginated list of all stadiums',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }, description: 'Items per page' },
        ],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Stadium' } },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Stadiums'],
        summary: 'Create a new stadium',
        description: 'Creates a new stadium in the system',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateStadiumDto' } } },
        },
        responses: { '200': { description: 'Stadium created successfully' } },
      },
    },
    '/stadiums/{id}': {
      get: {
        tags: ['Stadiums'],
        summary: 'Get stadium by ID',
        description: 'Retrieves a specific stadium by its ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Stadium ID' }],
        responses: { '200': { description: 'Success' } },
      },
      put: {
        tags: ['Stadiums'],
        summary: 'Update stadium',
        description: 'Updates an existing stadium',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Stadium ID' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateStadiumDto' } } },
        },
        responses: { '200': { description: 'Stadium updated successfully' } },
      },
      delete: {
        tags: ['Stadiums'],
        summary: 'Delete stadium',
        description: 'Deletes a stadium from the system',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Stadium ID' }],
        responses: { '200': { description: 'Stadium deleted successfully' } },
      },
    },
  },
  components: {
    schemas: {
      // SHARED SCHEMAS
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'number' },
          limit: { type: 'number' },
          total: { type: 'number' },
          totalPages: { type: 'number' },
        },
      },
      // TEAM SCHEMAS
      Team: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          logo: { type: 'string' },
          founded: { type: 'number' },
          stadiumId: { type: 'string' },
          city: { type: 'string' },
          country: { type: 'string' },
          coach: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateTeamDto: {
        type: 'object',
        required: ['name', 'founded', 'city', 'country'],
        properties: {
          name: { type: 'string', minLength: 1, description: 'Team name' },
          logo: { type: 'string', description: 'Team logo URL' },
          founded: { type: 'number', minimum: 1800, description: 'Year the team was founded' },
          stadiumId: { type: 'string', description: 'Stadium ID reference' },
          city: { type: 'string', minLength: 1, description: 'City where team is based' },
          country: { type: 'string', minLength: 1, description: 'Country where team is based' },
          coach: { type: 'string', description: 'Current coach name' },
        },
      },
      UpdateTeamDto: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          logo: { type: 'string' },
          founded: { type: 'number', minimum: 1800 },
          stadiumId: { type: 'string' },
          city: { type: 'string', minLength: 1 },
          country: { type: 'string', minLength: 1 },
          coach: { type: 'string' },
        },
      },
      // PLAYER SCHEMAS
      Player: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          teamId: { type: 'string' },
          position: { type: 'string', enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'] },
          number: { type: 'number' },
          birthDate: { type: 'string', format: 'date' },
          nationality: { type: 'string' },
          height: { type: 'number' },
          weight: { type: 'number' },
          goals: { type: 'number' },
          assists: { type: 'number' },
          yellowCards: { type: 'number' },
          redCards: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreatePlayerDto: {
        type: 'object',
        required: ['name', 'teamId', 'position', 'number', 'birthDate', 'nationality'],
        properties: {
          name: { type: 'string', minLength: 1, description: 'Player name' },
          teamId: { type: 'string', description: 'Team ID the player belongs to' },
          position: { type: 'string', enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'], description: 'Player position' },
          number: { type: 'number', minimum: 1, maximum: 99, description: 'Jersey number' },
          birthDate: { type: 'string', format: 'date', description: 'Birth date (YYYY-MM-DD)' },
          nationality: { type: 'string', minLength: 1, description: 'Player nationality' },
          height: { type: 'number', minimum: 150, maximum: 250, description: 'Height in cm' },
          weight: { type: 'number', minimum: 50, maximum: 150, description: 'Weight in kg' },
        },
      },
      UpdatePlayerDto: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          teamId: { type: 'string' },
          position: { type: 'string', enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'] },
          number: { type: 'number', minimum: 1, maximum: 99 },
          birthDate: { type: 'string', format: 'date' },
          nationality: { type: 'string', minLength: 1 },
          height: { type: 'number', minimum: 150, maximum: 250 },
          weight: { type: 'number', minimum: 50, maximum: 150 },
          goals: { type: 'number', minimum: 0 },
          assists: { type: 'number', minimum: 0 },
          yellowCards: { type: 'number', minimum: 0 },
          redCards: { type: 'number', minimum: 0 },
        },
      },
      // MATCH SCHEMAS
      Match: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          homeTeamId: { type: 'string' },
          awayTeamId: { type: 'string' },
          championshipId: { type: 'string' },
          stadiumId: { type: 'string' },
          date: { type: 'string', format: 'date-time' },
          homeScore: { type: 'number' },
          awayScore: { type: 'number' },
          status: { type: 'string', enum: ['scheduled', 'in_progress', 'finished', 'cancelled'] },
          round: { type: 'number' },
          attendance: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateMatchDto: {
        type: 'object',
        required: ['homeTeamId', 'awayTeamId', 'championshipId', 'date'],
        properties: {
          homeTeamId: { type: 'string', description: 'Home team ID' },
          awayTeamId: { type: 'string', description: 'Away team ID' },
          championshipId: { type: 'string', description: 'Championship ID' },
          stadiumId: { type: 'string', description: 'Stadium ID where match will be played' },
          date: { type: 'string', format: 'date-time', description: 'Match date and time (ISO 8601)' },
          round: { type: 'number', minimum: 1, description: 'Round number' },
        },
      },
      UpdateMatchDto: {
        type: 'object',
        properties: {
          homeTeamId: { type: 'string' },
          awayTeamId: { type: 'string' },
          championshipId: { type: 'string' },
          stadiumId: { type: 'string' },
          date: { type: 'string', format: 'date-time' },
          homeScore: { type: 'number', minimum: 0 },
          awayScore: { type: 'number', minimum: 0 },
          status: { type: 'string', enum: ['scheduled', 'in_progress', 'finished', 'cancelled'] },
          round: { type: 'number', minimum: 1 },
          attendance: { type: 'number', minimum: 0 },
        },
      },
      // CHAMPIONSHIP SCHEMAS
      Championship: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          year: { type: 'number' },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          teams: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['upcoming', 'ongoing', 'finished'] },
          standings: { type: 'array', items: { type: 'object' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateChampionshipDto: {
        type: 'object',
        required: ['name', 'year', 'startDate', 'teams'],
        properties: {
          name: { type: 'string', minLength: 1, description: 'Championship name' },
          year: { type: 'number', minimum: 1900, description: 'Championship year' },
          startDate: { type: 'string', format: 'date', description: 'Start date (YYYY-MM-DD)' },
          endDate: { type: 'string', format: 'date', description: 'End date (YYYY-MM-DD)' },
          teams: { type: 'array', items: { type: 'string' }, minItems: 2, description: 'Array of team IDs participating' },
        },
      },
      UpdateChampionshipDto: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          year: { type: 'number', minimum: 1900 },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          teams: { type: 'array', items: { type: 'string' }, minItems: 2 },
          status: { type: 'string', enum: ['upcoming', 'ongoing', 'finished'] },
        },
      },
      // STADIUM SCHEMAS
      Stadium: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          capacity: { type: 'number' },
          city: { type: 'string' },
          country: { type: 'string' },
          address: { type: 'string' },
          inaugurated: { type: 'number' },
          surface: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateStadiumDto: {
        type: 'object',
        required: ['name', 'capacity', 'city', 'country'],
        properties: {
          name: { type: 'string', minLength: 1, description: 'Stadium name' },
          capacity: { type: 'number', minimum: 100, description: 'Stadium capacity' },
          city: { type: 'string', minLength: 1, description: 'City where stadium is located' },
          country: { type: 'string', minLength: 1, description: 'Country where stadium is located' },
          address: { type: 'string', description: 'Stadium address' },
          inaugurated: { type: 'number', minimum: 1800, description: 'Year inaugurated' },
          surface: { type: 'string', description: 'Playing surface type (e.g., Grass, Artificial)' },
        },
      },
      UpdateStadiumDto: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          capacity: { type: 'number', minimum: 100 },
          city: { type: 'string', minLength: 1 },
          country: { type: 'string', minLength: 1 },
          address: { type: 'string' },
          inaugurated: { type: 'number', minimum: 1800 },
          surface: { type: 'string' },
        },
      },
    },
  },
};
