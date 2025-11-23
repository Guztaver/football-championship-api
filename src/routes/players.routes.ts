import { Router, Request, Response } from 'express';
import { PlayerModel } from '../models/player.model.js';

export const playersRouter = Router();

// Create Player
playersRouter.post('/', async (req: Request, res: Response) => {
    try {
        const player = await PlayerModel.create(req.body);
        res.json({
            success: true,
            data: player,
            message: 'Player created successfully',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Get All Players
playersRouter.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const teamId = req.query.teamId as string | undefined;
        const position = req.query.position as string | undefined;
        const result = await PlayerModel.findAll(page, limit, teamId, position);

        res.json({
            success: true,
            data: result.players,
            pagination: result.pagination,
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Get Player by ID
playersRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const player = await PlayerModel.findById(req.params.id);

        if (!player) {
            return res.json({
                success: false,
                error: 'Player not found',
            });
        }

        res.json({
            success: true,
            data: player,
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Update Player
playersRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const player = await PlayerModel.update(req.params.id, req.body);

        if (!player) {
            return res.json({
                success: false,
                error: 'Player not found',
            });
        }

        res.json({
            success: true,
            data: player,
            message: 'Player updated successfully',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Delete Player
playersRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleted = await PlayerModel.delete(req.params.id);

        if (!deleted) {
            return res.json({
                success: false,
                error: 'Player not found',
            });
        }

        res.json({
            success: true,
            message: 'Player deleted successfully',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});
