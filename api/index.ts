import { app } from '../src/index';
import { connectToDatabase } from '../src/config/database';

export default async function handler(req: any, res: any) {
    try {
        // Ensure database is connected
        await connectToDatabase();

        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        const url = new URL(req.url, `${protocol}://${host}`);

        const method = req.method;
        const headers = req.headers;

        // Create a Web Standard Request object
        const request = new Request(url.toString(), {
            method,
            headers,
            body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        });

        // Handle the request with Elysia
        const response = await app.handle(request);

        // Send the response back to Vercel
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        res.status(response.status);
        res.send(await response.text());
    } catch (error) {
        console.error('Vercel Handler Error:', error);
        res.status(500).send({
            success: false,
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : String(error)
        });
    }
}
