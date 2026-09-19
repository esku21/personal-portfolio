import jwt from 'jsonwebtoken';
import { env } from '../lib/env.js';
export function requireAuth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token)
        return res.status(401).json({ error: 'Authentication required' });
    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        if (typeof payload !== 'object' || typeof payload.sub !== 'string')
            throw new Error('Invalid token');
        req.adminId = payload.sub;
        next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
//# sourceMappingURL=auth.js.map