import { app } from '../src/app.js';
import { connectToDatabase } from '../src/config/database.js';
import type { Request, Response } from 'express';

let isConnected = false;

export default async function handler(req: Request, res: Response) {
    try {
        // Ensure database is connected (reuse connection)
        if (!isConnected) {
            await connectToDatabase();
            isConnected = true;
        }

        // Let Express handle the request
        app(req, res);
    } catch (error) {
        console.error('Vercel Handler Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : String(error),
        });
    }
}
