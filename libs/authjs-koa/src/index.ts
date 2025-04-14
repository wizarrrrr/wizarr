import type { AuthConfig } from "@auth/core";
import type { Session } from "@auth/core/types";
import * as k from "koa";
import { toWebRequest, toKoaResponse as toKoaResponse } from "./lib/index.js";
import bodyParser from "koa-bodyparser";

export async function getAuthProvider() {
    return await Function('return import("@auth/core")')();
}

// Object.defineProperty(exports, "AuthError", { enumerable: true, get: async function () { return errors_1.AuthError; } });
// Object.defineProperty(exports, "CredentialsSignin", { enumerable: true, get: function () { return errors_1.CredentialsSignin; } });

// export { AuthError, CredentialsSignin } from "@auth/core/errors";
// export type { Account, DefaultSession, Profile, Session, User } from "@auth/core/types";

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
    // onerror: (err, ctx) => {
    //     ctx.throw(400, err.message);
    // },
};

export function KoaAuth(config: KoaAuthConfig) {
    return async (ctx: k.ParameterizedContext<k.DefaultState, k.DefaultContext>, next: k.Next) => {
        // Parse JSON and URL-encoded bodies using koa-bodyparser
        await bodyParser(bodyParserOptions)(ctx, async () => {
            const { Auth, setEnvDefaults } = await getAuthProvider();

            // Set base path and environment defaults
            config.basePath = getBasePath(ctx);
            setEnvDefaults(process.env, config);

            // Convert Koa request to a web request and call Auth
            const webRequest = toWebRequest(ctx, config);
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

export async function getSession(ctx: k.ParameterizedContext<k.DefaultState, k.DefaultContext>, config: KoaAuthConfig): Promise<GetSessionResult> {
    const { Auth, setEnvDefaults, createActionURL } = await getAuthProvider();

    setEnvDefaults(process.env, config);

    const action = "session";
    const detectedProtocol = ctx.headers["x-forwarded-proto"] ? (Array.isArray(ctx.headers["x-forwarded-proto"]) ? ctx.headers["x-forwarded-proto"][0] : ctx.headers["x-forwarded-proto"]).split(",")[0] : ctx.protocol.split(",")[0];
    const _protocol = detectedProtocol.endsWith(":") ? detectedProtocol : detectedProtocol + ":";
    const headers = new Headers(ctx.headers as Record<string, string>);
    const env = process.env;

    headers.set("x-forwarded-proto", _protocol);

    console.log(ctx.headers);
    const url = createActionURL(action, _protocol, headers, env, config);
    const request = new Request(url, {
        headers: {
            cookie: ctx.headers.cookie ?? "",
        },
    });

    const response = await Auth(request, config);
    const data = await response.json();
    const status = response.status ?? 200;

    console.log(response, data);

    if (!data || !Object.keys(data).length) return null;
    if (status === 200) return data;
    throw new Error(data.message);
}

/**
 * Get the base path from the request URL.
 * @param ctx Koa request context.
 * @returns The base path.
 */
export function getBasePath(ctx: k.ParameterizedContext<k.DefaultState, k.DefaultContext>) {
    return ctx.originalUrl.split(ctx.path)[0].replace(/\/$/, "");
}
