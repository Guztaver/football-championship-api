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
    '/teams': {
      get: {
        tags: ['Teams'],
        summary: 'List all teams',
        description: 'Retrieves a paginated list of all teams',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
            description: 'Page number',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
            description: 'Items per page',
          },
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
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTeamDto' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Team created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Team' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/teams/{id}': {
      get: {
        tags: ['Teams'],
        summary: 'Get team by ID',
        description: 'Retrieves a specific team by its ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Team ID',
          },
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
                    data: { $ref: '#/components/schemas/Team' },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Teams'],
        summary: 'Update team',
        description: 'Updates an existing team',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Team ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTeamDto' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Team updated successfully',
          },
        },
      },
      delete: {
        tags: ['Teams'],
        summary: 'Delete team',
        description: 'Deletes a team from the system',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Team ID',
          },
        ],
        responses: {
          '200': {
            description: 'Team deleted successfully',
          },
        },
      },
    },
    '/teams/{id}/players': {
      get: {
        tags: ['Teams'],
        summary: 'Get team with players',
        description: 'Retrieves a team with all its players',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Team ID',
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
  },
  components: {
    schemas: {
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
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'number' },
          limit: { type: 'number' },
          total: { type: 'number' },
          totalPages: { type: 'number' },
        },
      },
    },
  },
};
