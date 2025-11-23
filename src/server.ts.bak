import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { connectToDatabase, closeDatabase } from './config/database';
import { teamsRoutes } from './routes/teams.routes';
import { playersRoutes } from './routes/players.routes';
import { matchesRoutes } from './routes/matches.routes';
import { championshipsRoutes } from './routes/championships.routes';
import { stadiumsRoutes } from './routes/stadiums.routes';

const PORT = process.env.PORT || 3000;

// Initialize Elysia app
const app = new Elysia()
    // CORS middleware
    .use(cors())

    // Swagger documentation
    .use(
        swagger({
            documentation: {
                info: {
                    title: 'Football Championship API',
                    version: '1.0.0',
                    description: 'Complete CRUD API for managing football championships, teams, players, matches, and stadiums',
                },
                tags: [
                    { name: 'Teams', description: 'Team management endpoints' },
                    { name: 'Players', description: 'Player management endpoints' },
                    { name: 'Matches', description: 'Match management endpoints' },
                    { name: 'Championships', description: 'Championship management endpoints' },
                    { name: 'Stadiums', description: 'Stadium management endpoints' },
                ],
                servers: [
                    {
                        url: 'http://localhost:3000',
                        description: 'Local development server',
                    },
                ],
            },
            path: '/swagger',
        })
    )

    // Health check endpoint
    .get('/', () => ({
        success: true,
        message: 'Football Championship API is running',
        version: '1.0.0',
        documentation: '/swagger',
    }), {
        detail: {
            tags: ['General'],
            summary: 'Health check',
            description: 'Check if the API is running and get basic information',
        },
    })

    // Register all routes
    .use(teamsRoutes)
    .use(playersRoutes)
    .use(matchesRoutes)
    .use(championshipsRoutes)
    .use(stadiumsRoutes)

    // Global error handler
    .onError(({ code, error, set }) => {
        console.error('Error:', error);

        if (code === 'VALIDATION') {
            set.status = 400;
            return {
                success: false,
                error: 'Validation error',
                details: String(error),
            };
        }

        if (code === 'NOT_FOUND') {
            set.status = 404;
            return {
                success: false,
                error: 'Route not found',
            };
        }

        set.status = 500;
        return {
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error),
        };
    });

// Start server
console.log('🔌 Connecting to MongoDB...');
await connectToDatabase();
console.log('✅ Successfully connected to MongoDB');

app.listen(PORT);

console.log('🚀 Football Championship API is running');
console.log(`📍 Server: http://localhost:${PORT}`);
console.log(`📚 Documentation: http://localhost:${PORT}/swagger`);
console.log('');
console.log('Available endpoints:');
console.log('  - GET    /');
console.log('  - CRUD   /teams');
console.log('  - CRUD   /players');
console.log('  - CRUD   /matches');
console.log('  - CRUD   /championships');
console.log('  - CRUD   /stadiums');

// Handle shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await closeDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await closeDatabase();
    process.exit(0);
});

export default app;
