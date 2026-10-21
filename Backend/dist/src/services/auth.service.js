import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { env } from '../lib/env.js';
export async function authenticate(email, password) {
    const admin = await prisma.admin.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash)))
        return null;
    const token = jwt.sign({ email: admin.email, name: admin.name }, env.JWT_SECRET, { subject: admin.id, expiresIn: '8h' });
    return { token, admin: { id: admin.id, email: admin.email, name: admin.name } };
}
export function findAdmin(id) {
    return prisma.admin.findUnique({ where: { id }, select: { id: true, email: true, name: true } });
}
export async function updateAdminAccount(id, data) {
    const admin = await prisma.admin.findUnique({ where: { id } });
    if (!admin)
        return null;
    if (data.newPassword) {
        const passwordMatches = data.currentPassword
            ? await bcrypt.compare(data.currentPassword, admin.passwordHash)
            : false;
        if (!passwordMatches)
            throw new Error('Current password is incorrect');
    }
    const passwordHash = data.newPassword ? await bcrypt.hash(data.newPassword, 12) : undefined;
    return prisma.admin.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
            ...(passwordHash ? { passwordHash } : {}),
        },
        select: { id: true, email: true, name: true },
    });
}
//# sourceMappingURL=auth.service.js.map