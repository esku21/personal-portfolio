import { updateAdminAccount } from '../services/auth.service.js';
import { createCertification, createEducation, createExperience, createProject, createService, createSkill, deleteCertification, deleteEducation, deleteExperience, deleteProject, deleteService, deleteSkill, getPortfolioReport, getProfile, listCertifications, listEducation, listExperience, listProjects, listServices, listSkills, updateCertification, updateEducation, updateExperience, updateProfile, updateProject, updateService, updateSkill } from '../services/portfolio.service.js';
import { deleteMessage, getStats, listMessages, updateMessageStatus } from '../services/message.service.js';
import { adminAccountSchema, certificationSchema, educationSchema, experienceSchema, messageStatusSchema, profileSchema, projectSchema, serviceSchema, skillSchema } from '../validators/index.js';
export async function stats(_req, res, next) {
    try {
        return res.json(await getStats());
    }
    catch (error) {
        return next(error);
    }
}
function parseReportDate(value) {
    if (value === undefined)
        return null;
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
        return undefined;
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? undefined : date;
}
function reportPeriod(from, to) {
    if (!from || !to)
        return null;
    if (from > to)
        return undefined;
    const toExclusive = new Date(to);
    toExclusive.setUTCDate(toExclusive.getUTCDate() + 1);
    return { from, toExclusive };
}
export async function reports(req, res, next) {
    const from = parseReportDate(req.query.from);
    const to = parseReportDate(req.query.to);
    const previousFrom = parseReportDate(req.query.previousFrom);
    const previousTo = parseReportDate(req.query.previousTo);
    if (from === undefined || to === undefined || previousFrom === undefined || previousTo === undefined) {
        return res.status(400).json({ error: 'Report dates must be valid YYYY-MM-DD dates.' });
    }
    if ((from === null) !== (to === null) || (previousFrom === null) !== (previousTo === null)) {
        return res.status(400).json({ error: 'Both start and end dates are required for each report period.' });
    }
    const currentPeriod = reportPeriod(from, to);
    const previousPeriod = reportPeriod(previousFrom, previousTo);
    if (currentPeriod === undefined || previousPeriod === undefined) {
        return res.status(400).json({ error: 'Report period start dates must not be after their end dates.' });
    }
    try {
        return res.json(await getPortfolioReport(currentPeriod, previousPeriod));
    }
    catch (error) {
        return next(error);
    }
}
export async function projects(_req, res, next) {
    try {
        return res.json(await listProjects());
    }
    catch (error) {
        return next(error);
    }
}
export async function create(req, res, next) {
    try {
        return res.status(201).json(await createProject(projectSchema.parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
export async function update(req, res, next) {
    try {
        return res.json(await updateProject(req.params.id, projectSchema.partial().parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
export async function remove(req, res, next) {
    try {
        await deleteProject(req.params.id);
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
}
export async function messages(_req, res, next) {
    try {
        return res.json(await listMessages());
    }
    catch (error) {
        return next(error);
    }
}
export async function updateMessage(req, res, next) {
    try {
        const { status } = messageStatusSchema.parse(req.body);
        return res.json(await updateMessageStatus(req.params.id, status));
    }
    catch (error) {
        return next(error);
    }
}
export async function removeMessage(req, res, next) {
    try {
        await deleteMessage(req.params.id);
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
}
export async function profile(_req, res, next) {
    try {
        return res.json(await getProfile());
    }
    catch (error) {
        return next(error);
    }
}
export async function saveProfile(req, res, next) {
    try {
        return res.json(await updateProfile(profileSchema.parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
export async function updateAccount(req, res, next) {
    try {
        const account = await updateAdminAccount(req.adminId, adminAccountSchema.parse(req.body));
        if (!account)
            return res.status(404).json({ error: 'Admin account not found' });
        return res.json(account);
    }
    catch (error) {
        if (error instanceof Error && error.message === 'Current password is incorrect') {
            return res.status(400).json({ error: error.message });
        }
        return next(error);
    }
}
function toExperienceData(input) {
    const { current, endDate, ...data } = input;
    return { ...data, endDate: current ? 'Present' : endDate || null };
}
export async function experience(_req, res, next) {
    try {
        return res.json(await listExperience());
    }
    catch (error) {
        return next(error);
    }
}
export async function createExperienceRecord(req, res, next) {
    try {
        const data = toExperienceData(experienceSchema.parse(req.body));
        return res.status(201).json(await createExperience(data));
    }
    catch (error) {
        return next(error);
    }
}
export async function updateExperienceRecord(req, res, next) {
    try {
        const parsed = experienceSchema.partial().parse(req.body);
        const { current, endDate, ...data } = parsed;
        const updateData = {
            ...data,
            ...(current !== undefined || endDate !== undefined
                ? { endDate: current ? 'Present' : endDate || null }
                : {}),
        };
        return res.json(await updateExperience(req.params.id, updateData));
    }
    catch (error) {
        return next(error);
    }
}
export async function deleteExperienceRecord(req, res, next) {
    try {
        await deleteExperience(req.params.id);
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
}
export async function education(_req, res, next) {
    try {
        return res.json(await listEducation());
    }
    catch (error) {
        return next(error);
    }
}
export async function createEducationRecord(req, res, next) {
    try {
        return res.status(201).json(await createEducation(educationSchema.parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
export async function updateEducationRecord(req, res, next) {
    try {
        return res.json(await updateEducation(req.params.id, educationSchema.partial().parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
export async function deleteEducationRecord(req, res, next) {
    try {
        await deleteEducation(req.params.id);
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
}
export async function skills(_req, res, next) {
    try {
        return res.json(await listSkills());
    }
    catch (error) {
        return next(error);
    }
}
export async function createSkillRecord(req, res, next) {
    try {
        return res.status(201).json(await createSkill(skillSchema.parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
export async function updateSkillRecord(req, res, next) {
    try {
        return res.json(await updateSkill(req.params.id, skillSchema.partial().parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
export async function deleteSkillRecord(req, res, next) {
    try {
        await deleteSkill(req.params.id);
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
}
export async function services(_req, res, next) {
    try {
        return res.json(await listServices());
    }
    catch (error) {
        return next(error);
    }
}
export async function createServiceRecord(req, res, next) {
    try {
        return res.status(201).json(await createService(serviceSchema.parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
export async function updateServiceRecord(req, res, next) {
    try {
        return res.json(await updateService(req.params.id, serviceSchema.partial().parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
export async function deleteServiceRecord(req, res, next) {
    try {
        await deleteService(req.params.id);
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
}
export async function certifications(_req, res, next) {
    try {
        return res.json(await listCertifications());
    }
    catch (error) {
        return next(error);
    }
}
export async function createCertificationRecord(req, res, next) {
    try {
        return res.status(201).json(await createCertification(certificationSchema.parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
export async function updateCertificationRecord(req, res, next) {
    try {
        return res.json(await updateCertification(req.params.id, certificationSchema.partial().parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
export async function deleteCertificationRecord(req, res, next) {
    try {
        await deleteCertification(req.params.id);
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
}
//# sourceMappingURL=admin.controller.js.map