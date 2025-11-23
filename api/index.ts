import { app } from '../src/index';

export default async function handler(req: any, res: any) {
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
}
