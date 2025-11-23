import { Elysia, t } from 'elysia';
import { PlayerModel } from '@/models/player.model';

export const playersRoutes = new Elysia({ prefix: '/players' })
    // Create Player
    .post(
        '/',
        async ({ body }) => {
            try {
                const player = await PlayerModel.create(body);
                return {
                    success: true,
                    data: player,
                    message: 'Player created successfully',
                };
            } catch (error: any) {
                return {
                    success: false,
                    error: error.message,
                };
            }
        },
        {
            body: t.Object({
                name: t.String({ minLength: 1, description: 'Player name' }),
                teamId: t.String({ description: 'Team ID the player belongs to' }),
                position: t.Union([
                    t.Literal('Goalkeeper'),
                    t.Literal('Defender'),
                    t.Literal('Midfielder'),
                    t.Literal('Forward'),
                ], { description: 'Player position' }),
                number: t.Number({ minimum: 1, maximum: 99, description: 'Jersey number' }),
                birthDate: t.String({ format: 'date', description: 'Birth date (YYYY-MM-DD)' }),
                nationality: t.String({ minLength: 1, description: 'Player nationality' }),
                height: t.Optional(t.Number({ minimum: 150, maximum: 250, description: 'Height in cm' })),
                weight: t.Optional(t.Number({ minimum: 50, maximum: 150, description: 'Weight in kg' })),
            }),
            detail: {
                tags: ['Players'],
                summary: 'Create a new player',
                description: 'Creates a new player and associates them with a team',
            },
        }
    )

    // Get All Players
    .get(
        '/',
        async ({ query }) => {
            try {
                const page = query.page || 1;
                const limit = query.limit || 10;
                const result = await PlayerModel.findAll(page, limit, query.teamId, query.position);

                return {
                    success: true,
                    data: result.players,
                    pagination: result.pagination,
                };
            } catch (error: any) {
                return {
                    success: false,
                    error: error.message,
                };
            }
        },
        {
            query: t.Object({
                page: t.Optional(t.Numeric({ minimum: 1, description: 'Page number' })),
                limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, description: 'Items per page' })),
                teamId: t.Optional(t.String({ description: 'Filter by team ID' })),
                position: t.Optional(t.String({ description: 'Filter by position' })),
            }),
            detail: {
                tags: ['Players'],
                summary: 'List all players',
                description: 'Retrieves a paginated list of players with optional filters',
            },
        }
    )

    // Get Player by ID
    .get(
        '/:id',
        async ({ params }) => {
            try {
                const player = await PlayerModel.findById(params.id);

                if (!player) {
                    return {
                        success: false,
                        error: 'Player not found',
                    };
                }

                return {
                    success: true,
                    data: player,
                };
            } catch (error: any) {
                return {
                    success: false,
                    error: error.message,
                };
            }
        },
        {
            params: t.Object({
                id: t.String({ description: 'Player ID' }),
            }),
            detail: {
                tags: ['Players'],
                summary: 'Get player by ID',
                description: 'Retrieves a specific player by their ID',
            },
        }
    )

    // Update Player
    .put(
        '/:id',
        async ({ params, body }) => {
            try {
                const player = await PlayerModel.update(params.id, body);

                if (!player) {
                    return {
                        success: false,
                        error: 'Player not found',
                    };
                }

                return {
                    success: true,
                    data: player,
                    message: 'Player updated successfully',
                };
            } catch (error: any) {
                return {
                    success: false,
                    error: error.message,
                };
            }
        },
        {
            params: t.Object({
                id: t.String({ description: 'Player ID' }),
            }),
            body: t.Object({
                name: t.Optional(t.String({ minLength: 1 })),
                teamId: t.Optional(t.String()),
                position: t.Optional(t.Union([
                    t.Literal('Goalkeeper'),
                    t.Literal('Defender'),
                    t.Literal('Midfielder'),
                    t.Literal('Forward'),
                ])),
                number: t.Optional(t.Number({ minimum: 1, maximum: 99 })),
                birthDate: t.Optional(t.String({ format: 'date' })),
                nationality: t.Optional(t.String({ minLength: 1 })),
                height: t.Optional(t.Number({ minimum: 150, maximum: 250 })),
                weight: t.Optional(t.Number({ minimum: 50, maximum: 150 })),
                goals: t.Optional(t.Number({ minimum: 0 })),
                assists: t.Optional(t.Number({ minimum: 0 })),
                yellowCards: t.Optional(t.Number({ minimum: 0 })),
                redCards: t.Optional(t.Number({ minimum: 0 })),
            }),
            detail: {
                tags: ['Players'],
                summary: 'Update player',
                description: 'Updates an existing player including statistics',
            },
        }
    )

    // Delete Player
    .delete(
        '/:id',
        async ({ params }) => {
            try {
                const deleted = await PlayerModel.delete(params.id);

                if (!deleted) {
                    return {
                        success: false,
                        error: 'Player not found',
                    };
                }

                return {
                    success: true,
                    message: 'Player deleted successfully',
                };
            } catch (error: any) {
                return {
                    success: false,
                    error: error.message,
                };
            }
        },
        {
            params: t.Object({
                id: t.String({ description: 'Player ID' }),
            }),
            detail: {
                tags: ['Players'],
                summary: 'Delete player',
                description: 'Deletes a player from the system',
            },
        }
    );
