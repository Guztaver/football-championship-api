import { Elysia, t } from 'elysia';
import { TeamModel } from '../models/team.model';

export const teamsRoutes = new Elysia({ prefix: '/teams' })
    // Create Team
    .post(
        '/',
        async ({ body }) => {
            try {
                const team = await TeamModel.create(body);
                return {
                    success: true,
                    data: team,
                    message: 'Team created successfully',
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
                name: t.String({ minLength: 1, description: 'Team name' }),
                logo: t.Optional(t.String({ description: 'Team logo URL' })),
                founded: t.Number({ minimum: 1800, description: 'Year the team was founded' }),
                stadiumId: t.Optional(t.String({ description: 'Stadium ID reference' })),
                city: t.String({ minLength: 1, description: 'City where team is based' }),
                country: t.String({ minLength: 1, description: 'Country where team is based' }),
                coach: t.Optional(t.String({ description: 'Current coach name' })),
            }),
            detail: {
                tags: ['Teams'],
                summary: 'Create a new team',
                description: 'Creates a new football team in the system',
            },
        }
    )

    // Get All Teams
    .get(
        '/',
        async ({ query }) => {
            try {
                const page = query.page || 1;
                const limit = query.limit || 10;
                const result = await TeamModel.findAll(page, limit);

                return {
                    success: true,
                    data: result.teams,
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
            }),
            detail: {
                tags: ['Teams'],
                summary: 'List all teams',
                description: 'Retrieves a paginated list of all teams',
            },
        }
    )

    // Get Team by ID
    .get(
        '/:id',
        async ({ params }) => {
            try {
                const team = await TeamModel.findById(params.id);

                if (!team) {
                    return {
                        success: false,
                        error: 'Team not found',
                    };
                }

                return {
                    success: true,
                    data: team,
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
                id: t.String({ description: 'Team ID' }),
            }),
            detail: {
                tags: ['Teams'],
                summary: 'Get team by ID',
                description: 'Retrieves a specific team by its ID',
            },
        }
    )

    // Get Team with Players
    .get(
        '/:id/players',
        async ({ params }) => {
            try {
                const team = await TeamModel.getWithPlayers(params.id);

                if (!team) {
                    return {
                        success: false,
                        error: 'Team not found',
                    };
                }

                return {
                    success: true,
                    data: team,
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
                id: t.String({ description: 'Team ID' }),
            }),
            detail: {
                tags: ['Teams'],
                summary: 'Get team with players',
                description: 'Retrieves a team with all its players',
            },
        }
    )

    // Update Team
    .put(
        '/:id',
        async ({ params, body }) => {
            try {
                const team = await TeamModel.update(params.id, body);

                if (!team) {
                    return {
                        success: false,
                        error: 'Team not found',
                    };
                }

                return {
                    success: true,
                    data: team,
                    message: 'Team updated successfully',
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
                id: t.String({ description: 'Team ID' }),
            }),
            body: t.Object({
                name: t.Optional(t.String({ minLength: 1 })),
                logo: t.Optional(t.String()),
                founded: t.Optional(t.Number({ minimum: 1800 })),
                stadiumId: t.Optional(t.String()),
                city: t.Optional(t.String({ minLength: 1 })),
                country: t.Optional(t.String({ minLength: 1 })),
                coach: t.Optional(t.String()),
            }),
            detail: {
                tags: ['Teams'],
                summary: 'Update team',
                description: 'Updates an existing team',
            },
        }
    )

    // Delete Team
    .delete(
        '/:id',
        async ({ params }) => {
            try {
                const deleted = await TeamModel.delete(params.id);

                if (!deleted) {
                    return {
                        success: false,
                        error: 'Team not found',
                    };
                }

                return {
                    success: true,
                    message: 'Team deleted successfully',
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
                id: t.String({ description: 'Team ID' }),
            }),
            detail: {
                tags: ['Teams'],
                summary: 'Delete team',
                description: 'Deletes a team from the system',
            },
        }
    );
