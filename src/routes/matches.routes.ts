import { Router, Request, Response } from 'express';
import { MatchModel } from '../models/match.model.js';

export const matchesRouter = Router();

// Create Match
matchesRouter.post('/', async (req: Request, res: Response) => {
    try {
        const match = await MatchModel.create(req.body);
        res.json({
            success: true,
            data: match,
            message: 'Partida criada com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Get All Matches
matchesRouter.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const filters: any = {};
        if (req.query.teamId) filters.teamId = req.query.teamId;
        if (req.query.championshipId) filters.championshipId = req.query.championshipId;
        if (req.query.status) filters.status = req.query.status;
        if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom;
        if (req.query.dateTo) filters.dateTo = req.query.dateTo;

        const result = await MatchModel.findAll(page, limit, filters);

        res.json({
            success: true,
            data: result.matches,
            pagination: result.pagination,
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Get Match by ID
matchesRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const match = await MatchModel.findByIdWithTeams(req.params.id);

        if (!match) {
            return res.json({
                success: false,
                error: 'Partida não encontrada',
            });
        }

        res.json({
            success: true,
            data: match,
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Update Match
matchesRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const match = await MatchModel.update(req.params.id, req.body);

        if (!match) {
            return res.json({
                success: false,
                error: 'Match not found',
            });
        }

        res.json({
            success: true,
            data: match,
            message: 'Partida atualizada com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Update Match Score
matchesRouter.patch('/:id/score', async (req: Request, res: Response) => {
    try {
        const { homeScore, awayScore } = req.body;
        const match = await MatchModel.updateScore(req.params.id, homeScore, awayScore);

        if (!match) {
            return res.json({
                success: false,
                error: 'Match not found',
            });
        }

        res.json({
            success: true,
            data: match,
            message: 'Placar da partida atualizado com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Delete Match
matchesRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleted = await MatchModel.delete(req.params.id);

        if (!deleted) {
            return res.json({
                success: false,
                error: 'Match not found',
            });
        }

        res.json({
            success: true,
            message: 'Partida deletada com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});
