import request from 'supertest';
import { app } from "../index";

describe('CORS Configuration', () => {
    it('should allow requests from allowed origins', async () => {
        const res = await request(app)
            .get('/duties')
            .set('Origin', process.env.FRONTEND_URL || 'http://localhost:3000');

        expect(res.headers['access-control-allow-origin']).toBe(process.env.FRONTEND_URL || 'http://localhost:3000');
        expect(res.status).not.toBe(403);
    });

    it('should block requests from disallowed origins', async () => {
        const res = await request(app)
            .get('/duties')
            .set('Origin', 'http://unauthorized-origin.com');

        expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });
});
