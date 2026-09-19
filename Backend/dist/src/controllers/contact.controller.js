import { createMessage } from '../services/message.service.js';
import { contactSchema } from '../validators/index.js';
export async function contact(req, res, next) {
    try {
        const message = await createMessage(contactSchema.parse(req.body));
        return res.status(201).json({ message: 'Thanks for reaching out.', id: message.id });
    }
    catch (error) {
        return next(error);
    }
}
//# sourceMappingURL=contact.controller.js.map