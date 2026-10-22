import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class.js";
import * as Prisma from "./internal/prismaNamespace.js";
export * as $Enums from './enums.js';
export * from "./enums.js";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Admins
 * const admins = await prisma.admin.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model Admin
 *
 */
export type Admin = Prisma.AdminModel;
/**
 * Model Profile
 *
 */
export type Profile = Prisma.ProfileModel;
/**
 * Model Project
 *
 */
export type Project = Prisma.ProjectModel;
/**
 * Model Skill
 *
 */
export type Skill = Prisma.SkillModel;
/**
 * Model Experience
 *
 */
export type Experience = Prisma.ExperienceModel;
/**
 * Model Education
 *
 */
export type Education = Prisma.EducationModel;
/**
 * Model Certification
 *
 */
export type Certification = Prisma.CertificationModel;
/**
 * Model Service
 *
 */
export type Service = Prisma.ServiceModel;
/**
 * Model ContactMessage
 *
 */
export type ContactMessage = Prisma.ContactMessageModel;
