import { Elysia, t } from 'elysia';
import { MatchModel } from '@/models/match.model';

export const matchesRoutes = new Elysia({ prefix: '/matches' })
    // Create Match
    .post(
        '/',
        async ({ body }) => {
            try {
                const match = await MatchModel.create(body);
                return {
                    success: true,
                    data: match,
                    message: 'Match created successfully',
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
                homeTeamId: t.String({ description: 'Home team ID' }),
                awayTeamId: t.String({ description: 'Away team ID' }),
                championshipId: t.String({ description: 'Championship ID' }),
                stadiumId: t.Optional(t.String({ description: 'Stadium ID where match will be played' })),
                date: t.String({ format: 'date-time', description: 'Match date and time (ISO 8601)' }),
                round: t.Optional(t.Number({ minimum: 1, description: 'Round number' })),
            }),
            detail: {
                tags: ['Matches'],
                summary: 'Schedule a new match',
                description: 'Creates a new match between two teams in a championship',
            },
        }
    )

    // Get All Matches
    .get(
        '/',
        async ({ query }) => {
            try {
                const page = query.page || 1;
                const limit = query.limit || 10;

                const filters: any = {};
                if (query.teamId) filters.teamId = query.teamId;
                if (query.championshipId) filters.championshipId = query.championshipId;
                if (query.status) filters.status = query.status;
                if (query.dateFrom) filters.dateFrom = query.dateFrom;
                if (query.dateTo) filters.dateTo = query.dateTo;

                const result = await MatchModel.findAll(page, limit, filters);

                return {
                    success: true,
                    data: result.matches,
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
                teamId: t.Optional(t.String({ description: 'Filter by team ID (home or away)' })),
                championshipId: t.Optional(t.String({ description: 'Filter by championship ID' })),
                status: t.Optional(t.String({ description: 'Filter by status' })),
                dateFrom: t.Optional(t.String({ format: 'date', description: 'Filter matches from this date' })),
                dateTo: t.Optional(t.String({ format: 'date', description: 'Filter matches to this date' })),
            }),
            detail: {
                tags: ['Matches'],
                summary: 'List all matches',
                description: 'Retrieves a paginated list of matches with optional filters',
            },
        }
    )

    // Get Match by ID
    .get(
        '/:id',
        async ({ params }) => {
            try {
                const match = await MatchModel.findByIdWithTeams(params.id);

                if (!match) {
                    return {
                        success: false,
                        error: 'Match not found',
                    };
                }

                return {
                    success: true,
                    data: match,
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
                id: t.String({ description: 'Match ID' }),
            }),
            detail: {
                tags: ['Matches'],
                summary: 'Get match by ID',
                description: 'Retrieves a specific match with team details',
            },
        }
    )

    // Update Match
    .put(
        '/:id',
        async ({ params, body }) => {
            try {
                const match = await MatchModel.update(params.id, body);

                if (!match) {
                    return {
                        success: false,
                        error: 'Match not found',
                    };
                }

                return {
                    success: true,
                    data: match,
                    message: 'Match updated successfully',
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
                id: t.String({ description: 'Match ID' }),
            }),
            body: t.Object({
                homeTeamId: t.Optional(t.String()),
                awayTeamId: t.Optional(t.String()),
                championshipId: t.Optional(t.String()),
                stadiumId: t.Optional(t.String()),
                date: t.Optional(t.String({ format: 'date-time' })),
                homeScore: t.Optional(t.Number({ minimum: 0 })),
                awayScore: t.Optional(t.Number({ minimum: 0 })),
                status: t.Optional(t.Union([
                    t.Literal('scheduled'),
                    t.Literal('in_progress'),
                    t.Literal('finished'),
                    t.Literal('cancelled'),
                ])),
                round: t.Optional(t.Number({ minimum: 1 })),
                attendance: t.Optional(t.Number({ minimum: 0 })),
            }),
            detail: {
                tags: ['Matches'],
                summary: 'Update match',
                description: 'Updates match details including scores and status',
            },
        }
    )

    // Update Match Score
    .patch(
        '/:id/score',
        async ({ params, body }) => {
            try {
                const match = await MatchModel.updateScore(params.id, body.homeScore, body.awayScore);

                if (!match) {
                    return {
                        success: false,
                        error: 'Match not found',
                    };
                }

                return {
                    success: true,
                    data: match,
                    message: 'Match score updated successfully',
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
                id: t.String({ description: 'Match ID' }),
            }),
            body: t.Object({
                homeScore: t.Number({ minimum: 0, description: 'Home team score' }),
                awayScore: t.Number({ minimum: 0, description: 'Away team score' }),
            }),
            detail: {
                tags: ['Matches'],
                summary: 'Update match score',
                description: 'Updates the final score of a match and sets it to finished',
            },
        }
    )

    // Delete Match
    .delete(
        '/:id',
        async ({ params }) => {
            try {
                const deleted = await MatchModel.delete(params.id);

                if (!deleted) {
                    return {
                        success: false,
                        error: 'Match not found',
                    };
                }

                return {
                    success: true,
                    message: 'Match deleted successfully',
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
                id: t.String({ description: 'Match ID' }),
            }),
            detail: {
                tags: ['Matches'],
                summary: 'Delete match',
                description: 'Deletes a match from the system',
            },
        }
    );
