import { authenticate, findAdmin } from '../services/auth.service.js';
import { loginSchema } from '../validators/index.js';
export async function login(req, res, next) {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const result = await authenticate(email, password);
        if (!result)
            return res.status(401).json({ error: 'Invalid credentials' });
        return res.json(result);
    }
    catch (error) {
        return next(error);
    }
}
export async function me(req, res, next) {
    try {
        return res.json(await findAdmin(req.adminId));
    }
    catch (error) {
        return next(error);
    }
}
//# sourceMappingURL=auth.controller.js.map