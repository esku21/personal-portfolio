import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { env } from '../lib/env.js';
export async function authenticate(email, password) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash)))
        return null;
    const token = jwt.sign({ email: admin.email, name: admin.name }, env.JWT_SECRET, { subject: admin.id, expiresIn: '8h' });
    return { token, admin: { id: admin.id, email: admin.email, name: admin.name } };
}
export function findAdmin(id) {
    return prisma.admin.findUnique({ where: { id }, select: { id: true, email: true, name: true } });
}
//# sourceMappingURL=auth.service.js.map