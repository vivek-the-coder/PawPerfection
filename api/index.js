
import app, { connectServices } from '../Backend/index.js';

export default async function handler(req, res) {
    // Ensure Redis/DB are connected before handling request
    await connectServices();
    app(req, res);
}
