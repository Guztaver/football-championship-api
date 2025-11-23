import { Router, Request, Response } from 'express';
import { ChampionshipModel } from '../models/championship.model.js';

export const championshipsRouter = Router();

// Create Championship
championshipsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const championship = await ChampionshipModel.create(req.body);
        res.json({
            success: true,
            data: championship,
            message: 'Campeonato criado com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Get All Championships
championshipsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const year = req.query.year ? parseInt(req.query.year as string) : undefined;
        const result = await ChampionshipModel.findAll(page, limit, year);

        res.json({
            success: true,
            data: result.championships,
            pagination: result.pagination,
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Get Championship by ID
championshipsRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const championship = await ChampionshipModel.findById(req.params.id);

        if (!championship) {
            return res.json({
                success: false,
                error: 'Campeonato não encontrado',
            });
        }

        res.json({
            success: true,
            data: championship,
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Get Championship Standings
championshipsRouter.get('/:id/standings', async (req: Request, res: Response) => {
    try {
        const standings = await ChampionshipModel.getStandings(req.params.id);

        if (!standings) {
            return res.json({
                success: false,
                error: 'Championship not found',
            });
        }

        res.json({
            success: true,
            data: standings,
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Recalculate Championship Standings
championshipsRouter.post('/:id/standings/recalculate', async (req: Request, res: Response) => {
    try {
        const standings = await ChampionshipModel.calculateStandings(req.params.id);

        res.json({
            success: true,
            data: standings,
            message: 'Classificação recalculada com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Update Championship
championshipsRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const championship = await ChampionshipModel.update(req.params.id, req.body);

        if (!championship) {
            return res.json({
                success: false,
                error: 'Championship not found',
            });
        }

        res.json({
            success: true,
            data: championship,
            message: 'Campeonato atualizado com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Delete Championship
championshipsRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleted = await ChampionshipModel.delete(req.params.id);

        if (!deleted) {
            return res.json({
                success: false,
                error: 'Championship not found',
            });
        }

        res.json({
            success: true,
            message: 'Campeonato deletado com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});
