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
 * genSalt - Generates a salt for use in hashing passwords.
 * @param length The length of the salt to generate.
 * @returns A salt of the specified length.
 */
export const genSalt = (length: number): string => {
    // Generate a salt of the specified length
    return customAlphabet(SALT_CHARS, length)();
};

/**
 * genHash - Generates a hash for the specified password.
 * @param password The password to hash.
 * @param salt The salt to use in hashing the password.
 */
export const genHash = async (method: Methods, salt: string, password: string, opts: Partial<ScryptOpts> = {}): Promise<{ actual: string; salt: string; hash: string; rawHash: Uint8Array }> => {
    // Generate the hash for the password
    const hash = await scryptAsync(password, salt, { N: opts.N ?? N, r: opts.r ?? R, p: opts.p ?? P, dkLen: opts.dkLen ?? DKLEN, maxmem: opts.maxmem ?? MAXMEM });
    // Convert the hash into a string
    const hashString = Buffer.from(hash).toString("hex");
    // Return the hash
    return { actual: `${method}:${N}:${R}:${P}`, salt: salt, hash: hashString, rawHash: hash };
};

/**
 * hashPassword - Generates a hash for the specified password.
 * @param password The password to hash.
 * @param salt The salt to use in hashing the password.
 */
export const hashPassword = async (password: string): Promise<string> => {
    // Generate a salt
    const salt = genSalt(SALT_LENGTH);
    // Generate the hash for the password
    const hashObject = await genHash("scrypt", salt, password);
    // Return the hash
    return `${hashObject.actual}$${hashObject.salt}$${hashObject.hash}`;
};

/**
 * checkPassword - Checks the specified password against the specified hash.
 * @param password The password to check.
 * @param hash The hash to check against.
 * @returns True if the password matches the hash, false otherwise.
 */
export const checkPassword = async (password: string, hash: string): Promise<boolean> => {
    // Split the hash into its components
    const [params, salt, hashString] = hash.split("$", 3);
    // Split the parameters into their components
    const [method, N, R, P] = params.split(":", 4);
    // Convert the hash string into a buffer
    const hashBuffer = Buffer.from(hashString, "hex");
    // Generate the hash for the password
    const hashObject = await genHash(method as Methods, salt, password, { N: parseInt(N), r: parseInt(R), p: parseInt(P) });
    // Return whether or not the hashes match
    return hashBuffer.equals(hashObject.rawHash);
};
