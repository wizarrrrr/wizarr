import { ScryptOpts, scryptAsync } from "@noble/hashes/scrypt";
import { customAlphabet } from "nanoid";

// I made this password helper all by myself (without Google), I'm so proud of myself. :D

// Salt Parameters
const SALT_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SALT_LENGTH = 16;

// Scrypt Parameters
const N = 2 ** 15;
const R = 8;
const P = 1;
const DKLEN = 64;
const MAXMEM = 132 * N * R * P;

export type Methods = "scrypt";

/**
 * Generates a salt for use in hashing passwords.
 * @param length The length of the salt to generate.
 * @returns A salt of the specified length.
 */
export const genSalt = (length: number): string => {
    return customAlphabet(SALT_CHARS, length)();
};

/**
 * Generates a hash for the specified password.
 * @param password The password to hash.
 * @param salt The salt to use in hashing the password.
 */
export const genHash = async (method: Methods, salt: string, password: string, opts: Partial<ScryptOpts> = {}): Promise<{ actual: string; salt: string; hash: string; rawHash: Uint8Array }> => {
    const hash = await scryptAsync(password, salt, { N: opts.N ?? N, r: opts.r ?? R, p: opts.p ?? P, dkLen: opts.dkLen ?? DKLEN, maxmem: opts.maxmem ?? MAXMEM });
    const hashString = Buffer.from(hash).toString("hex");
    return { actual: `${method}:${N}:${R}:${P}`, salt: salt, hash: hashString, rawHash: hash };
};

/**
 * Generates a hash for the specified password.
 * @param password The password to hash.
 * @param salt The salt to use in hashing the password.
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = genSalt(SALT_LENGTH);
    const hashObject = await genHash("scrypt", salt, password);
    return `${hashObject.actual}$${hashObject.salt}$${hashObject.hash}`;
};

/**
 * Checks the specified password against the specified hash.
 * @param password The password to check.
 * @param hash The hash to check against.
 * @returns True if the password matches the hash, false otherwise.
 */
export const checkPassword = async (password: string, hash: string): Promise<boolean> => {
    const [params, salt, hashString] = hash.split("$", 3);
    const [method, N, R, P] = params.split(":", 4);
    const hashBuffer = Buffer.from(hashString, "hex");
    const hashObject = await genHash(method as Methods, salt, password, { N: parseInt(N), r: parseInt(R), p: parseInt(P) });
    return hashBuffer.equals(hashObject.rawHash);
};
