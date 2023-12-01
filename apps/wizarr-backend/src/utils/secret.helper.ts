import { databasePath } from "../config/paths";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { resolve } from "path";
import { KeyObject, createPrivateKey, createPublicKey, generateKeyPair } from "crypto";
import { cache, secretCache } from "./cache.helper";
import app from "@/main";

// Global variables for this helper
export const privateKeyFile = resolve(databasePath, "private.key");
export const privateKeyExists = existsSync(privateKeyFile);

export const publicKeyFile = resolve(databasePath, "public.key");
export const publicKeyExists = existsSync(publicKeyFile);

export const cachedPrivateKey = async (): Promise<string> => cache(secretCache, async () => await privateKey(), "private_key");
export const cachedPublicKey = async (): Promise<string> => cache(secretCache, async () => await publicKey(), "public_key");

/**
 * existsKeyPair - Checks if a key pair exists for the application
 * @async
 * @returns {Promise<boolean>}
 */
export const existsKeyPair = (): boolean => {
    return privateKeyExists && publicKeyExists;
};

/**
 * createKeyPair - Creates a key pair for the application
 * @async
 * @returns {Promise<string, string>}
 */
export const createKeyPair = async (): Promise<{ publicKey: KeyObject; privateKey: KeyObject }> => {
    return new Promise<{ publicKey: KeyObject; privateKey: KeyObject }>((resolve, reject) => {
        generateKeyPair("rsa", { modulusLength: 4096 }, (err, publicKey, privateKey) => {
            if (err) reject(err);
            writeFileSync(privateKeyFile, privateKey.export({ format: "pem", type: "pkcs1" }), "utf8");
            writeFileSync(publicKeyFile, publicKey.export({ format: "pem", type: "pkcs1" }), "utf8");
            app.log.info("Created new key pair for the application");
            resolve({ publicKey, privateKey });
        });
    });
};

/**
 * getKeyPair - Gets the key pair for the application
 * @async
 * @returns {Promise<{ publicKey: KeyObject; privateKey: KeyObject }>}
 */
export const getKeyPair = async (): Promise<{ publicKey: KeyObject; privateKey: KeyObject }> => {
    if (!existsKeyPair()) await createKeyPair();
    const privateKeyRaw = readFileSync(privateKeyFile, "utf8");
    const privateKey = createPrivateKey({ key: privateKeyRaw });
    const publicKey = createPublicKey({ key: privateKeyRaw });
    return { publicKey, privateKey };
};

/**
 * privateKey - Gets the private key for the application
 * @async
 * @returns {Promise<string | Buffer>}
 */
export const privateKey = async (): Promise<string | Buffer> => {
    return (await getKeyPair()).privateKey.export({ format: "pem", type: "pkcs1" });
};

/**
 * publicKey - Gets the public key for the application
 * @async
 * @returns {Promise<string | Buffer>}
 */
export const publicKey = async (): Promise<string | Buffer> => {
    return (await getKeyPair()).publicKey.export({ format: "pem", type: "pkcs1" });
};
