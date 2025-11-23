import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { connectToDatabase, closeDatabase } from '@/config/database';
import { teamsRoutes } from '@/routes/teams.routes';
import { playersRoutes } from '@/routes/players.routes';
import { matchesRoutes } from '@/routes/matches.routes';
import { championshipsRoutes } from '@/routes/championships.routes';
import { stadiumsRoutes } from '@/routes/stadiums.routes';

const PORT = process.env.PORT || 3000;

// ... imports

// Initialize Elysia app
export const app = new Elysia()
    // ... middleware and routes
    .use(cors())
    .use(swagger({
        // ... swagger config
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
                    url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
                    description: process.env.VERCEL_URL ? 'Production server' : 'Local development server',
                },
            ],
        },
        path: '/swagger',
    }))
    // ... routes
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
    .use(teamsRoutes)
    .use(playersRoutes)
    .use(matchesRoutes)
    .use(championshipsRoutes)
    .use(stadiumsRoutes)
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

// Start server only if run directly
if (import.meta.main) {
    connectToDatabase()
        .then(() => {
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
        })
        .catch((error) => {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        });
}

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

