import { Elysia, t } from 'elysia';
import { StadiumModel } from '../models/stadium.model';

export const stadiumsRoutes = new Elysia({ prefix: '/stadiums' })
    // Create Stadium
    .post(
        '/',
        async ({ body }) => {
            try {
                const stadium = await StadiumModel.create(body);
                return {
                    success: true,
                    data: stadium,
                    message: 'Stadium created successfully',
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
                name: t.String({ minLength: 1, description: 'Stadium name' }),
                capacity: t.Number({ minimum: 100, description: 'Stadium capacity' }),
                city: t.String({ minLength: 1, description: 'City where stadium is located' }),
                country: t.String({ minLength: 1, description: 'Country where stadium is located' }),
                address: t.Optional(t.String({ description: 'Stadium address' })),
                inaugurated: t.Optional(t.Number({ minimum: 1800, description: 'Year inaugurated' })),
                surface: t.Optional(t.String({ description: 'Playing surface type (e.g., Grass, Artificial)' })),
            }),
            detail: {
                tags: ['Stadiums'],
                summary: 'Create a new stadium',
                description: 'Creates a new stadium in the system',
            },
        }
    )

    // Get All Stadiums
    .get(
        '/',
        async ({ query }) => {
            try {
                const page = query.page || 1;
                const limit = query.limit || 10;
                const result = await StadiumModel.findAll(page, limit);

                return {
                    success: true,
                    data: result.stadiums,
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
                tags: ['Stadiums'],
                summary: 'List all stadiums',
                description: 'Retrieves a paginated list of all stadiums',
            },
        }
    )

    // Get Stadium by ID
    .get(
        '/:id',
        async ({ params }) => {
            try {
                const stadium = await StadiumModel.findById(params.id);

                if (!stadium) {
                    return {
                        success: false,
                        error: 'Stadium not found',
                    };
                }

                return {
                    success: true,
                    data: stadium,
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
                id: t.String({ description: 'Stadium ID' }),
            }),
            detail: {
                tags: ['Stadiums'],
                summary: 'Get stadium by ID',
                description: 'Retrieves a specific stadium by its ID',
            },
        }
    )

    // Update Stadium
    .put(
        '/:id',
        async ({ params, body }) => {
            try {
                const stadium = await StadiumModel.update(params.id, body);

                if (!stadium) {
                    return {
                        success: false,
                        error: 'Stadium not found',
                    };
                }

                return {
                    success: true,
                    data: stadium,
                    message: 'Stadium updated successfully',
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
                id: t.String({ description: 'Stadium ID' }),
            }),
            body: t.Object({
                name: t.Optional(t.String({ minLength: 1 })),
                capacity: t.Optional(t.Number({ minimum: 100 })),
                city: t.Optional(t.String({ minLength: 1 })),
                country: t.Optional(t.String({ minLength: 1 })),
                address: t.Optional(t.String()),
                inaugurated: t.Optional(t.Number({ minimum: 1800 })),
                surface: t.Optional(t.String()),
            }),
            detail: {
                tags: ['Stadiums'],
                summary: 'Update stadium',
                description: 'Updates an existing stadium',
            },
        }
    )

    // Delete Stadium
    .delete(
        '/:id',
        async ({ params }) => {
            try {
                const deleted = await StadiumModel.delete(params.id);

                if (!deleted) {
                    return {
                        success: false,
                        error: 'Stadium not found',
                    };
                }

                return {
                    success: true,
                    message: 'Stadium deleted successfully',
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
                id: t.String({ description: 'Stadium ID' }),
            }),
            detail: {
                tags: ['Stadiums'],
                summary: 'Delete stadium',
                description: 'Deletes a stadium from the system',
            },
        }
    );
