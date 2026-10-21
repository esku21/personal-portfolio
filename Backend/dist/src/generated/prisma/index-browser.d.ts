export declare var __esModule: boolean;
export { Prisma };
export declare var $Enums: {};
export { PrismaClient };
import { Decimal, DbNull, JsonNull, AnyNull, NullTypes, makeStrictEnum, Public, getRuntime, skip } from './runtime/index-browser.js';
declare const Prisma: {
    /**
     * Prisma Client JS version: 7.10.0
     * Query Engine version: 0edf323efd1d98336f3f0a68684b56f689b900d3
     */
    prismaVersion: {
        client: string;
        engine: string;
    };
    PrismaClientKnownRequestError: () => never;
    PrismaClientUnknownRequestError: () => never;
    PrismaClientRustPanicError: () => never;
    PrismaClientInitializationError: () => never;
    PrismaClientValidationError: () => never;
    Decimal: typeof Decimal;
    /**
     * Re-export of sql-template-tag
     */
    sql: () => never;
    empty: () => never;
    join: () => never;
    raw: () => never;
    validator: typeof Public.validator;
    /**
    * Extensions
    */
    getExtensionContext: () => never;
    defineExtension: () => never;
    /**
     * Shorthand utilities for JSON filtering
     */
    DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
    NullTypes: {
        DbNull: typeof import("@prisma/client-runtime-utils").DbNullClass;
        JsonNull: typeof import("@prisma/client-runtime-utils").JsonNullClass;
        AnyNull: typeof import("@prisma/client-runtime-utils").AnyNullClass;
    };
};
/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
declare class PrismaClient {
    constructor();
}
