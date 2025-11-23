import { Router, Request, Response } from 'express';
import { StadiumModel } from '../models/stadium.model.js';

export const stadiumsRouter = Router();

// Create Stadium
stadiumsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const stadium = await StadiumModel.create(req.body);
        res.json({
            success: true,
            data: stadium,
            message: 'Estádio criado com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Get All Stadiums
stadiumsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await StadiumModel.findAll(page, limit);

        res.json({
            success: true,
            data: result.stadiums,
            pagination: result.pagination,
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Get Stadium by ID
stadiumsRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const stadium = await StadiumModel.findById(req.params.id);

        if (!stadium) {
            return res.json({
                success: false,
                error: 'Estádio não encontrado',
            });
        }

        res.json({
            success: true,
            data: stadium,
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Update Stadium
stadiumsRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const stadium = await StadiumModel.update(req.params.id, req.body);

        if (!stadium) {
            return res.json({
                success: false,
                error: 'Stadium not found',
            });
        }

        res.json({
            success: true,
            data: stadium,
            message: 'Estádio atualizado com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Delete Stadium
stadiumsRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleted = await StadiumModel.delete(req.params.id);

        if (!deleted) {
            return res.json({
                success: false,
                error: 'Stadium not found',
            });
        }

        res.json({
            success: true,
            message: 'Estádio deletado com sucesso',
        });
    } catch (error: any) {
        res.json({
            success: false,
            error: error.message,
        });
    }
});
