import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiReference } from '@scalar/express-api-reference';
import { connectToDatabase, closeDatabase } from './config/database.js';
import { openApiSpec } from './config/scalar.js';
import { teamsRouter } from './routes/teams.routes.js';
import { playersRouter } from './routes/players.routes.js';
import { matchesRouter } from './routes/matches.routes.js';
import { championshipsRouter } from './routes/championships.routes.js';
import { stadiumsRouter } from './routes/stadiums.routes.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize Express app
export const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation with Scalar
app.use(
    '/api-docs',
    apiReference({
        spec: {
            content: openApiSpec,
        },
        theme: 'purple',
    })
);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'API de Campeonato de Futebol está rodando',
        version: '1.0.0',
        documentation: '/api-docs',
    });
});

// Mount route handlers
app.use('/teams', teamsRouter);
app.use('/players', playersRouter);
app.use('/matches', matchesRouter);
app.use('/championships', championshipsRouter);
app.use('/stadiums', stadiumsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Rota não encontrada',
    });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Erro:', err);

    res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        details: err.message,
    });
});

// Start server function
async function startServer() {
    try {
        await connectToDatabase();

        app.listen(PORT, () => {
            console.log('🚀 API de Campeonato de Futebol está rodando');
            console.log(`📍 Servidor: http://localhost:${PORT}`);
            console.log(`📚 Documentação: http://localhost:${PORT}/api-docs`);
            console.log('');
            console.log('Endpoints disponíveis:');
            console.log('  - GET    /');
            console.log('  - CRUD   /teams');
            console.log('  - CRUD   /players');
            console.log('  - CRUD   /matches');
            console.log('  - CRUD   /championships');
            console.log('  - CRUD   /stadiums');
        });
    } catch (error) {
        console.error('❌ Falha ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Only start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    startServer();
}

// Handle shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Encerrando graciosamente...');
    await closeDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Encerrando graciosamente...');
    await closeDatabase();
    process.exit(0);
});
