import { SignOptions, decode, sign } from "jsonwebtoken";
import { randomBytes } from "crypto";

/**
 * Creates a JWT Access Token for the given identity
 * @param identity The identity to create the JWT Token for
 * @returns The JWT Token
 */
export const createAccessToken = async (identity: string) => {
    // Get the private key for signing the JWT Token
    const key = env("JWT_SECRET", "secret");

    // Create a JWT options object
    const options: SignOptions = {
        expiresIn: "10m",
        issuer: "wizarr",
        jwtid: randomBytes(16).toString("hex"),
    };

    // Create a JWT payload object
    const payload = {
        sub: identity,
        type: "access",
        fresh: true,
    };

    // Create a JWT Token
    return sign(payload, key, options);
};

/**
 * Creates a JWT Refresh Token for the given identity
 * @param identity The identity to create the JWT Token for
 * @returns The JWT Token
 */
export const createRefreshToken = async (identity: string) => {
    // Get the private key for signing the JWT Token
    const key = env("JWT_SECRET", "secret");

    // Create a JWT options object
    const options: SignOptions = {
        expiresIn: "7d",
        issuer: "wizarr",
        jwtid: randomBytes(16).toString("hex"),
    };

    // Create a JWT payload object
    const payload = {
        sub: identity,
        type: "refresh",
        fresh: false,
    };

    // Create a JWT Token
    return sign(payload, key, options);
};

/**
 * Gets the JTI from the given JWT Token
 * @param token The JWT Token to get the JTI from
 * @returns The JTI
 */
export const getJTI = async (token: string) => {
    // Decode the JWT Token
    const decoded = decode(token);

    // Check if the JWT Token is valid
    if (typeof decoded === "string") throw new Error("Invalid JWT Token");

    // Return the JTI
    return decoded?.jti;
};
