import { Elysia, t } from 'elysia';
import { ChampionshipModel } from '../models/championship.model';

export const championshipsRoutes = new Elysia({ prefix: '/championships' })
    // Create Championship
    .post(
        '/',
        async ({ body }) => {
            try {
                const championship = await ChampionshipModel.create(body);
                return {
                    success: true,
                    data: championship,
                    message: 'Championship created successfully',
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
                name: t.String({ minLength: 1, description: 'Championship name' }),
                year: t.Number({ minimum: 1900, description: 'Championship year' }),
                startDate: t.String({ format: 'date', description: 'Start date (YYYY-MM-DD)' }),
                endDate: t.Optional(t.String({ format: 'date', description: 'End date (YYYY-MM-DD)' })),
                teams: t.Array(t.String(), { minItems: 2, description: 'Array of team IDs participating' }),
            }),
            detail: {
                tags: ['Championships'],
                summary: 'Create a new championship',
                description: 'Creates a new championship with participating teams',
            },
        }
    )

    // Get All Championships
    .get(
        '/',
        async ({ query }) => {
            try {
                const page = query.page || 1;
                const limit = query.limit || 10;
                const result = await ChampionshipModel.findAll(page, limit, query.year);

                return {
                    success: true,
                    data: result.championships,
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
                year: t.Optional(t.Numeric({ minimum: 1900, description: 'Filter by year' })),
            }),
            detail: {
                tags: ['Championships'],
                summary: 'List all championships',
                description: 'Retrieves a paginated list of championships with optional year filter',
            },
        }
    )

    // Get Championship by ID
    .get(
        '/:id',
        async ({ params }) => {
            try {
                const championship = await ChampionshipModel.findById(params.id);

                if (!championship) {
                    return {
                        success: false,
                        error: 'Championship not found',
                    };
                }

                return {
                    success: true,
                    data: championship,
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
                id: t.String({ description: 'Championship ID' }),
            }),
            detail: {
                tags: ['Championships'],
                summary: 'Get championship by ID',
                description: 'Retrieves a specific championship by its ID',
            },
        }
    )

    // Get Championship Standings
    .get(
        '/:id/standings',
        async ({ params }) => {
            try {
                const standings = await ChampionshipModel.getStandings(params.id);

                if (!standings) {
                    return {
                        success: false,
                        error: 'Championship not found',
                    };
                }

                return {
                    success: true,
                    data: standings,
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
                id: t.String({ description: 'Championship ID' }),
            }),
            detail: {
                tags: ['Championships'],
                summary: 'Get championship standings',
                description: 'Retrieves the current standings table for a championship with team details',
            },
        }
    )

    // Recalculate Championship Standings
    .post(
        '/:id/standings/recalculate',
        async ({ params }) => {
            try {
                const standings = await ChampionshipModel.calculateStandings(params.id);

                return {
                    success: true,
                    data: standings,
                    message: 'Standings recalculated successfully',
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
                id: t.String({ description: 'Championship ID' }),
            }),
            detail: {
                tags: ['Championships'],
                summary: 'Recalculate standings',
                description: 'Manually triggers standings recalculation based on match results',
            },
        }
    )

    // Update Championship
    .put(
        '/:id',
        async ({ params, body }) => {
            try {
                const championship = await ChampionshipModel.update(params.id, body);

                if (!championship) {
                    return {
                        success: false,
                        error: 'Championship not found',
                    };
                }

                return {
                    success: true,
                    data: championship,
                    message: 'Championship updated successfully',
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
                id: t.String({ description: 'Championship ID' }),
            }),
            body: t.Object({
                name: t.Optional(t.String({ minLength: 1 })),
                year: t.Optional(t.Number({ minimum: 1900 })),
                startDate: t.Optional(t.String({ format: 'date' })),
                endDate: t.Optional(t.String({ format: 'date' })),
                teams: t.Optional(t.Array(t.String(), { minItems: 2 })),
                status: t.Optional(t.Union([
                    t.Literal('upcoming'),
                    t.Literal('ongoing'),
                    t.Literal('finished'),
                ])),
            }),
            detail: {
                tags: ['Championships'],
                summary: 'Update championship',
                description: 'Updates an existing championship',
            },
        }
    )

    // Delete Championship
    .delete(
        '/:id',
        async ({ params }) => {
            try {
                const deleted = await ChampionshipModel.delete(params.id);

                if (!deleted) {
                    return {
                        success: false,
                        error: 'Championship not found',
                    };
                }

                return {
                    success: true,
                    message: 'Championship deleted successfully',
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
                id: t.String({ description: 'Championship ID' }),
            }),
            detail: {
                tags: ['Championships'],
                summary: 'Delete championship',
                description: 'Deletes a championship from the system',
            },
        }
    );
