# API de Campeonato de Futebol

Uma API CRUD completa para gerenciar campeonatos de futebol construída com ElysiaJS, MongoDB e Docker.

## 🚀 Funcionalidades

- **Operações CRUD Completas** para:
  - Times
  - Jogadores
  - Partidas
  - Campeonatos
  - Estádios

- **Funcionalidades Avançadas**:
  - Cálculo automático de classificação
  - Rastreamento de estatísticas de jogadores
  - Filtro de partidas por data, time e campeonato
  - Suporte à paginação
  - Documentação abrangente da API com Swagger

## 📋 Requisitos

- Runtime [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/) e Docker Compose
- MongoDB (via Docker)

## 🛠️ Configuração

### 1. Clone o repositório

```bash
git clone <url-do-seu-repo>
cd football-championship-api
```

### 2. Instale as dependências

```bash
bun install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

A configuração padrão:
```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017
MONGODB_DATABASE=football_championship
PORT=3000
NODE_ENV=development
```

### 4. Inicie o MongoDB com Docker

```bash
docker-compose up -d
```

Verifique se o MongoDB está rodando:
```bash
docker-compose ps
```

### 5. Inicie o servidor da API

```bash
bun run dev
```

O servidor iniciará em `http://localhost:3000`

## 📚 Documentação da API

Uma vez que o servidor esteja rodando, acesse a documentação Swagger em:
```
http://localhost:3000/swagger
```

## 🔗 Endpoints da API

### Times
- `POST /teams` - Criar um novo time
- `GET /teams` - Listar todos os times (paginado)
- `GET /teams/:id` - Buscar time por ID
- `GET /teams/:id/players` - Buscar time com todos os jogadores
- `PUT /teams/:id` - Atualizar time
- `DELETE /teams/:id` - Deletar time

### Jogadores
- `POST /players` - Criar um novo jogador
- `GET /players` - Listar todos os jogadores (paginado, filtrável por time/posição)
- `GET /players/:id` - Buscar jogador por ID
- `PUT /players/:id` - Atualizar jogador
- `DELETE /players/:id` - Deletar jogador

### Partidas
- `POST /matches` - Agendar uma nova partida
- `GET /matches` - Listar todas as partidas (filtrável por time, campeonato, data, status)
- `GET /matches/:id` - Buscar partida por ID com detalhes dos times
- `PUT /matches/:id` - Atualizar partida
- `PATCH /matches/:id/score` - Atualizar placar da partida
- `DELETE /matches/:id` - Deletar partida

### Campeonatos
- `POST /championships` - Criar um novo campeonato
- `GET /championships` - Listar todos os campeonatos (filtrável por ano)
- `GET /championships/:id` - Buscar campeonato por ID
- `GET /championships/:id/standings` - Buscar classificação do campeonato
- `POST /championships/:id/standings/recalculate` - Recalcular classificação
- `PUT /championships/:id` - Atualizar campeonato
- `DELETE /championships/:id` - Deletar campeonato

### Estádios
- `POST /stadiums` - Criar um novo estádio
- `GET /stadiums` - Listar todos os estádios (paginado)
- `GET /stadiums/:id` - Buscar estádio por ID
- `PUT /stadiums/:id` - Atualizar estádio
- `DELETE /stadiums/:id` - Deletar estádio

## 📝 Exemplos de Uso

### Criar um Time

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

### Criar um Jogador

```bash
curl -X POST http://localhost:3000/players \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lionel Messi",
    "teamId": "id-do-seu-time",
    "position": "Forward",
    "number": 10,
    "birthDate": "1987-06-24",
    "nationality": "Argentina"
  }'
```

### Agendar uma Partida

```bash
curl -X POST http://localhost:3000/matches \
  -H "Content-Type: application/json" \
  -d '{
    "homeTeamId": "id-do-time-1",
    "awayTeamId": "id-do-time-2",
    "championshipId": "id-do-campeonato",
    "date": "2024-12-25T20:00:00Z",
    "round": 1
  }'
```

### Atualizar Placar da Partida

```bash
curl -X PATCH http://localhost:3000/matches/id-da-partida/score \
  -H "Content-Type: application/json" \
  -d '{
    "homeScore": 3,
    "awayScore": 1
  }'
```

## 🐳 Comandos Docker

Iniciar MongoDB:
```bash
bun run docker:up
# ou
docker-compose up -d
```

Parar MongoDB:
```bash
bun run docker:down
# ou
docker-compose down
```

Ver logs do MongoDB:
```bash
bun run docker:logs
# ou
docker-compose logs -f
```

## 🧪 Desenvolvimento

Executar em modo de desenvolvimento com hot reload:
```bash
bun run dev
```

Build para produção:
```bash
bun run build
```

Executar em produção:
```bash
bun run start
```

## 🏗️ Estrutura do Projeto

```
football-championship-api/
├── src/
│   ├── config/
│   │   └── database.ts          # Conexão MongoDB
│   ├── models/
│   │   ├── team.model.ts        # Model & repositório de Time
│   │   ├── player.model.ts      # Model & repositório de Jogador
│   │   ├── match.model.ts       # Model & repositório de Partida
│   │   ├── championship.model.ts # Model & repositório de Campeonato
│   │   └── stadium.model.ts     # Model & repositório de Estádio
│   ├── routes/
│   │   ├── teams.routes.ts      # Endpoints de Times
│   │   ├── players.routes.ts    # Endpoints de Jogadores
│   │   ├── matches.routes.ts    # Endpoints de Partidas
│   │   ├── championships.routes.ts # Endpoints de Campeonatos
│   │   └── stadiums.routes.ts   # Endpoints de Estádios
│   ├── types/
│   │   └── index.ts             # Tipos TypeScript
│   └── index.ts                 # Entrada principal da aplicação
├── docker-compose.yml           # Configuração Docker
├── package.json
├── tsconfig.json
└── README.md
```

## 📊 Modelos de Dados

### Time
- nome, logo, ano de fundação, cidade, país, técnico
- Relações: possui muitos jogadores, possui um estádio

### Jogador
- nome, posição, número, data de nascimento, nacionalidade, altura, peso
- Estatísticas: gols, assistências, cartões amarelos/vermelhos
- Relações: pertence a um time

### Partida
- times mandante/visitante, campeonato, data, placares, status, rodada, público
- Relações: pertence a um campeonato, possui dois times

### Campeonato
- nome, ano, datas de início/fim, times, classificação, status
- Calcula automaticamente a classificação baseada nos resultados das partidas

### Estádio
- nome, capacidade, cidade, país, endereço, ano de inauguração, tipo de superfície

## 🌐 Deployment

### Vercel

Este projeto está configurado para deployment na Vercel usando Serverless Functions.

#### Pré-requisitos
1. **MongoDB Atlas**: Como a Vercel é serverless, você não pode usar o MongoDB local do Docker. Você precisa de um MongoDB hospedado na nuvem.
   - Crie uma conta gratuita no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Crie um novo cluster.
   - Crie um usuário de banco de dados.
   - Obtenha a string de conexão (URI).

#### Passos para Deployment

1. **Instale a CLI da Vercel** (opcional se fizer deploy via Git):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Variáveis de Ambiente**:
   Ao fazer o deploy, a Vercel solicitará variáveis de ambiente. Você deve fornecer:
   - `MONGODB_URI`: Sua string de conexão do MongoDB Atlas (ex: `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority`)
   - `MONGODB_DATABASE`: Nome do seu banco de dados (ex: `football_championship`)

   Você também pode configurar estas variáveis no Dashboard da Vercel em Settings > Environment Variables.

#### Nota sobre Runtime
O projeto usa um adaptador customizado em `api/index.ts` para rodar ElysiaJS no runtime Node.js da Vercel. Isso garante compatibilidade com o ambiente serverless da Vercel mantendo a experiência de desenvolvimento do ElysiaJS.

## 📄 Licença

MIT

## 👨‍💻 Autor

Construído com ElysiaJS, MongoDB e Docker para OAT2 - Curso de Desenvolvimento de APIs
