import { Router, Request, Response } from 'express';
import { TeamModel } from '../models/team.model.js';

export const teamsRouter = Router();

// Create Team
teamsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const team = await TeamModel.create(req.body);
        res.json({
            success: true,
            data: team,
            message: 'Time criado com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Get All Teams
teamsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await TeamModel.findAll(page, limit);

        res.json({
            success: true,
            data: result.teams,
            pagination: result.pagination,
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Get Team by ID
teamsRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const team = await TeamModel.findById(req.params.id);

        if (!team) {
            return res.json({
                success: false,
                error: 'Time não encontrado',
            });
        }

        res.json({
            success: true,
            data: team,
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Get Team with Players
teamsRouter.get('/:id/players', async (req: Request, res: Response) => {
    try {
        const team = await TeamModel.getWithPlayers(req.params.id);

        if (!team) {
            return res.json({
                success: false,
                error: 'Time não encontrado',
            });
        }

        res.json({
            success: true,
            data: team,
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Update Team
teamsRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const team = await TeamModel.update(req.params.id, req.body);

        if (!team) {
            return res.json({
                success: false,
                error: 'Time não encontrado',
            });
        }

        res.json({
            success: true,
            data: team,
            message: 'Time atualizado com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Delete Team
teamsRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleted = await TeamModel.delete(req.params.id);

        if (!deleted) {
            return res.json({
                success: false,
                error: 'Time não encontrado',
            });
        }

        res.json({
            success: true,
            message: 'Time deletado com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});
