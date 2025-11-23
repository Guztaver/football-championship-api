export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'API de Campeonato de Futebol',
    version: '1.0.0',
    description: 'API CRUD completa para gerenciar campeonatos de futebol, times, jogadores, partidas e estádios',
  },
  servers: [
    {
      url: 'https://footbal-api-red.vercel.app/',
      description: 'Servidor de produção',
    },
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desenvolvimento local',
    },
  ],
  tags: [
    { name: 'Geral', description: 'Endpoints gerais da API' },
    { name: 'Times', description: 'Endpoints de gerenciamento de times' },
    { name: 'Jogadores', description: 'Endpoints de gerenciamento de jogadores' },
    { name: 'Partidas', description: 'Endpoints de gerenciamento de partidas' },
    { name: 'Campeonatos', description: 'Endpoints de gerenciamento de campeonatos' },
    { name: 'Estádios', description: 'Endpoints de gerenciamento de estádios' },
  ],
  paths: {
    '/': {
      get: {
        tags: ['Geral'],
        summary: 'Verificação de saúde',
        description: 'Verifica se a API está rodando e obtém informações básicas',
        responses: {
          '200': {
            description: 'API está rodando',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'API de Campeonato de Futebol está rodando' },
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
        tags: ['Times'],
        summary: 'Listar todos os times',
        description: 'Recupera uma lista paginada de todos os times',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: 'Número da página' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }, description: 'Itens por página' },
        ],
        responses: {
          '200': {
            description: 'Sucesso',
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
        tags: ['Times'],
        summary: 'Criar um novo time',
        description: 'Cria um novo time de futebol no sistema',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTeamDto' } } },
        },
        responses: {
          '200': { description: 'Time criado com sucesso' },
        },
      },
    },
    '/teams/{id}': {
      get: {
        tags: ['Times'],
        summary: 'Buscar time por ID',
        description: 'Recupera um time específico pelo seu ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Time' }],
        responses: { '200': { description: 'Sucesso' } },
      },
      put: {
        tags: ['Times'],
        summary: 'Atualizar time',
        description: 'Atualiza um time existente',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Time' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTeamDto' } } },
        },
        responses: { '200': { description: 'Time atualizado com sucesso' } },
      },
      delete: {
        tags: ['Times'],
        summary: 'Deletar time',
        description: 'Deleta um time do sistema',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Time' }],
        responses: { '200': { description: 'Time deletado com sucesso' } },
      },
    },
    '/teams/{id}/players': {
      get: {
        tags: ['Times'],
        summary: 'Buscar time com jogadores',
        description: 'Recupera um time com todos os seus jogadores',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Time' }],
        responses: { '200': { description: 'Sucesso' } },
      },
    },
    // PLAYERS ENDPOINTS
    '/players': {
      get: {
        tags: ['Jogadores'],
        summary: 'Listar todos os jogadores',
        description: 'Recupera uma lista paginada de jogadores com filtros opcionais',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: 'Número da página' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }, description: 'Itens por página' },
          { name: 'teamId', in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID do time' },
          { name: 'position', in: 'query', schema: { type: 'string' }, description: 'Filtrar por posição' },
        ],
        responses: {
          '200': {
            description: 'Sucesso',
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
        tags: ['Jogadores'],
        summary: 'Criar um novo jogador',
        description: 'Cria um novo jogador e o associa a um time',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePlayerDto' } } },
        },
        responses: { '200': { description: 'Jogador criado com sucesso' } },
      },
    },
    '/players/{id}': {
      get: {
        tags: ['Jogadores'],
        summary: 'Buscar jogador por ID',
        description: 'Recupera um jogador específico pelo seu ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Jogador' }],
        responses: { '200': { description: 'Sucesso' } },
      },
      put: {
        tags: ['Jogadores'],
        summary: 'Atualizar jogador',
        description: 'Atualiza um jogador existente incluindo estatísticas',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Jogador' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdatePlayerDto' } } },
        },
        responses: { '200': { description: 'Jogador atualizado com sucesso' } },
      },
      delete: {
        tags: ['Jogadores'],
        summary: 'Deletar jogador',
        description: 'Deleta um jogador do sistema',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Jogador' }],
        responses: { '200': { description: 'Jogador deletado com sucesso' } },
      },
    },
    // MATCHES ENDPOINTS
    '/matches': {
      get: {
        tags: ['Partidas'],
        summary: 'Listar todas as partidas',
        description: 'Recupera uma lista paginada de partidas com filtros opcionais',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: 'Número da página' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }, description: 'Itens por página' },
          { name: 'teamId', in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID do time (mandante ou visitante)' },
          { name: 'championshipId', in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID do campeonato' },
          { name: 'status', in: 'query', schema: { type: 'string' }, description: 'Filtrar por status' },
          { name: 'dateFrom', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Filtrar partidas a partir desta data' },
          { name: 'dateTo', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Filtrar partidas até esta data' },
        ],
        responses: {
          '200': {
            description: 'Sucesso',
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
        tags: ['Partidas'],
        summary: 'Agendar uma nova partida',
        description: 'Cria uma nova partida entre dois times em um campeonato',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateMatchDto' } } },
        },
        responses: { '200': { description: 'Partida criada com sucesso' } },
      },
    },
    '/matches/{id}': {
      get: {
        tags: ['Partidas'],
        summary: 'Buscar partida por ID',
        description: 'Recupera uma partida específica com detalhes dos times',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da Partida' }],
        responses: { '200': { description: 'Sucesso' } },
      },
      put: {
        tags: ['Partidas'],
        summary: 'Atualizar partida',
        description: 'Atualiza detalhes da partida incluindo placares e status',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da Partida' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateMatchDto' } } },
        },
        responses: { '200': { description: 'Partida atualizada com sucesso' } },
      },
      delete: {
        tags: ['Partidas'],
        summary: 'Deletar partida',
        description: 'Deleta uma partida do sistema',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da Partida' }],
        responses: { '200': { description: 'Partida deletada com sucesso' } },
      },
    },
    '/matches/{id}/score': {
      patch: {
        tags: ['Partidas'],
        summary: 'Atualizar placar da partida',
        description: 'Atualiza o placar final de uma partida e define como finalizada',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da Partida' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['homeScore', 'awayScore'],
                properties: {
                  homeScore: { type: 'number', minimum: 0, description: 'Placar do time mandante' },
                  awayScore: { type: 'number', minimum: 0, description: 'Placar do time visitante' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Placar da partida atualizado com sucesso' } },
      },
    },
    // CHAMPIONSHIPS ENDPOINTS
    '/championships': {
      get: {
        tags: ['Campeonatos'],
        summary: 'Listar todos os campeonatos',
        description: 'Recupera uma lista paginada de campeonatos com filtro opcional de ano',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: 'Número da página' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }, description: 'Itens por página' },
          { name: 'year', in: 'query', schema: { type: 'integer', minimum: 1900 }, description: 'Filtrar por ano' },
        ],
        responses: {
          '200': {
            description: 'Sucesso',
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
        tags: ['Campeonatos'],
        summary: 'Criar um novo campeonato',
        description: 'Cria um novo campeonato com times participantes',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateChampionshipDto' } } },
        },
        responses: { '200': { description: 'Campeonato criado com sucesso' } },
      },
    },
    '/championships/{id}': {
      get: {
        tags: ['Campeonatos'],
        summary: 'Buscar campeonato por ID',
        description: 'Recupera um campeonato específico pelo seu ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Campeonato' }],
        responses: { '200': { description: 'Sucesso' } },
      },
      put: {
        tags: ['Campeonatos'],
        summary: 'Atualizar campeonato',
        description: 'Atualiza um campeonato existente',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Campeonato' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateChampionshipDto' } } },
        },
        responses: { '200': { description: 'Campeonato atualizado com sucesso' } },
      },
      delete: {
        tags: ['Campeonatos'],
        summary: 'Deletar campeonato',
        description: 'Deleta um campeonato do sistema',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Campeonato' }],
        responses: { '200': { description: 'Campeonato deletado com sucesso' } },
      },
    },
    '/championships/{id}/standings': {
      get: {
        tags: ['Campeonatos'],
        summary: 'Buscar classificação do campeonato',
        description: 'Recupera a tabela de classificação atual de um campeonato com detalhes dos times',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Campeonato' }],
        responses: { '200': { description: 'Sucesso' } },
      },
    },
    '/championships/{id}/standings/recalculate': {
      post: {
        tags: ['Campeonatos'],
        summary: 'Recalcular classificação',
        description: 'Dispara manualmente o recálculo da classificação baseado nos resultados das partidas',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Campeonato' }],
        responses: { '200': { description: 'Classificação recalculada com sucesso' } },
      },
    },
    // STADIUMS ENDPOINTS
    '/stadiums': {
      get: {
        tags: ['Estádios'],
        summary: 'Listar todos os estádios',
        description: 'Recupera uma lista paginada de todos os estádios',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: 'Número da página' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }, description: 'Itens por página' },
        ],
        responses: {
          '200': {
            description: 'Sucesso',
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
        tags: ['Estádios'],
        summary: 'Criar um novo estádio',
        description: 'Cria um novo estádio no sistema',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateStadiumDto' } } },
        },
        responses: { '200': { description: 'Estádio criado com sucesso' } },
      },
    },
    '/stadiums/{id}': {
      get: {
        tags: ['Estádios'],
        summary: 'Buscar estádio por ID',
        description: 'Recupera um estádio específico pelo seu ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Estádio' }],
        responses: { '200': { description: 'Sucesso' } },
      },
      put: {
        tags: ['Estádios'],
        summary: 'Atualizar estádio',
        description: 'Atualiza um estádio existente',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Estádio' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateStadiumDto' } } },
        },
        responses: { '200': { description: 'Estádio atualizado com sucesso' } },
      },
      delete: {
        tags: ['Estádios'],
        summary: 'Deletar estádio',
        description: 'Deleta um estádio do sistema',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do Estádio' }],
        responses: { '200': { description: 'Estádio deletado com sucesso' } },
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
          name: { type: 'string', minLength: 1, description: 'Nome do time' },
          logo: { type: 'string', description: 'URL do logo do time' },
          founded: { type: 'number', minimum: 1800, description: 'Ano de fundação do time' },
          stadiumId: { type: 'string', description: 'Referência ao ID do estádio' },
          city: { type: 'string', minLength: 1, description: 'Cidade onde o time é sediado' },
          country: { type: 'string', minLength: 1, description: 'País onde o time é sediado' },
          coach: { type: 'string', description: 'Nome do técnico atual' },
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
          name: { type: 'string', minLength: 1, description: 'Nome do jogador' },
          teamId: { type: 'string', description: 'ID do time ao qual o jogador pertence' },
          position: { type: 'string', enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'], description: 'Posição do jogador' },
          number: { type: 'number', minimum: 1, maximum: 99, description: 'Número da camisa' },
          birthDate: { type: 'string', format: 'date', description: 'Data de nascimento (AAAA-MM-DD)' },
          nationality: { type: 'string', minLength: 1, description: 'Nacionalidade do jogador' },
          height: { type: 'number', minimum: 150, maximum: 250, description: 'Altura em cm' },
          weight: { type: 'number', minimum: 50, maximum: 150, description: 'Peso em kg' },
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
          homeTeamId: { type: 'string', description: 'ID do time mandante' },
          awayTeamId: { type: 'string', description: 'ID do time visitante' },
          championshipId: { type: 'string', description: 'ID do campeonato' },
          stadiumId: { type: 'string', description: 'ID do estádio onde a partida será jogada' },
          date: { type: 'string', format: 'date-time', description: 'Data e hora da partida (ISO 8601)' },
          round: { type: 'number', minimum: 1, description: 'Número da rodada' },
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
          name: { type: 'string', minLength: 1, description: 'Nome do campeonato' },
          year: { type: 'number', minimum: 1900, description: 'Ano do campeonato' },
          startDate: { type: 'string', format: 'date', description: 'Data de início (AAAA-MM-DD)' },
          endDate: { type: 'string', format: 'date', description: 'Data de término (AAAA-MM-DD)' },
          teams: { type: 'array', items: { type: 'string' }, minItems: 2, description: 'Array de IDs dos times participantes' },
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
          name: { type: 'string', minLength: 1, description: 'Nome do estádio' },
          capacity: { type: 'number', minimum: 100, description: 'Capacidade do estádio' },
          city: { type: 'string', minLength: 1, description: 'Cidade onde o estádio está localizado' },
          country: { type: 'string', minLength: 1, description: 'País onde o estádio está localizado' },
          address: { type: 'string', description: 'Endereço do estádio' },
          inaugurated: { type: 'number', minimum: 1800, description: 'Ano de inauguração' },
          surface: { type: 'string', description: 'Tipo de superfície (ex: Grama, Artificial)' },
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
