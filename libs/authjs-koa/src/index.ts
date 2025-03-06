import { Auth, type AuthConfig, setEnvDefaults, createActionURL, customFetch } from "@auth/core";
import type { Session } from "@auth/core/types";
import * as k from "koa";
import { toWebRequest, toKoaResponse as toKoaResponse } from "./lib/index.js";
import bodyParser from "koa-bodyparser";

export { customFetch };
export { AuthError, CredentialsSignin } from "@auth/core/errors";
export type { Account, DefaultSession, Profile, Session, User } from "@auth/core/types";

export type KoaAuthConfig = Omit<AuthConfig, "raw">;

const bodyParserOptions: bodyParser.Options = {
    enableTypes: ["json", "form"], // Handle both JSON and URL-encoded bodies
    extendTypes: {
        json: ["application/json"], // Explicitly handle JSON
        form: ["application/x-www-form-urlencoded"], // Explicitly handle URL-encoded
    },
    jsonLimit: "1mb", // Adjust as needed
    formLimit: "1mb", // Adjust as needed
    strict: true, // Disable parsing of non-object/array JSON
    onerror: (err: Error, ctx: k.Context) => {
        ctx.throw(400, "Invalid body"); // Handle parsing errors
    },
};

export function KoaAuth(config: KoaAuthConfig) {
    return async (ctx: k.Context, next: k.Next) => {
        // Parse JSON and URL-encoded bodies using koa-bodyparser
        await bodyParser(bodyParserOptions)(ctx, async () => {
            // Set base path and environment defaults
            config.basePath = getBasePath(ctx.request);
            setEnvDefaults(process.env, config);

            // Convert Koa request to a web request and call Auth
            const webRequest = toWebRequest(ctx.request);
            const authResponse = await Auth(webRequest, config);

            // Convert the Auth response to a Koa response
            await toKoaResponse(authResponse, ctx);

            // If headers are not sent, proceed to the next middleware
            if (!ctx.headerSent) {
                await next();
            }
        });
    };
}

export type GetSessionResult = Promise<Session | null>;

export async function getSession(req: k.Request, config: KoaAuthConfig): Promise<GetSessionResult> {
    setEnvDefaults(process.env, config);
    const url = createActionURL(
        "session",
        "https",
        // @ts-expect-error - Express Request type is not compatible with Web Request
        new Headers(req.headers),
        process.env,
        config,
    );

    const response = await Auth(new Request(url, { headers: { cookie: req.headers.cookie ?? "" } }), config);

    const { status = 200 } = response;

    const data = await response.json();

    if (!data || !Object.keys(data).length) return null;
    if (status === 200) return data;
    throw new Error(data.message);
}

/**
 * Get the base path from the request URL.
 * @param ctx Koa request context.
 * @returns The base path.
 */
function getBasePath(ctx: k.Request) {
    return ctx.originalUrl.split(ctx.path)[0].replace(/\/$/, "");
}
