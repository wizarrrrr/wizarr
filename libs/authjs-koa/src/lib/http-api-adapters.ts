import * as k from "koa";
import { getBasePath, KoaAuthConfig } from "../index.js";

/**
 * Encodes an object as url-encoded string.
 * @param object The object to encode
 * @returns The encoded string
 */
export function encodeUrlEncoded(object: Record<string, unknown> = {}) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(object)) {
        if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
        } else {
            params.append(key, value as string);
        }
    }

    return params.toString();
}

/**
 * Encodes an object as JSON
 * @param obj The object to encode
 * @returns The encoded string
 */
function encodeJson(obj: Record<string, unknown>) {
    return JSON.stringify(obj);
}

/**
 * Encodes an Koa Request body based on the content type header.
 * @param req The Koa Request
 * @returns The encoded body
 */
function encodeRequestBody(ctx: k.Request): BodyInit {
    const contentType = ctx.headers["content-type"];

    if (contentType?.includes("application/x-www-form-urlencoded")) {
        return encodeUrlEncoded(ctx.body as Record<string, unknown>);
    }

    if (contentType?.includes("application/json")) {
        return encodeJson(ctx.body as Record<string, unknown>);
    }

    return ctx.body as BodyInit;
}

/**
 * Adapts an Koa Request to a Web Request, returning the Web Request.
 * @param req The Koa Request
 * @returns The Web Request
 */
export function toWebRequest(ctx: k.ParameterizedContext<k.DefaultState, k.DefaultContext>, config: KoaAuthConfig) {
    const basePath = config?.basePath ?? getBasePath(ctx);
    const envUrl = process.env["AUTH_URL"] ?? process.env["NEXTAUTH_URL"];
    const headers = new Headers(ctx.headers as Record<string, string>);

    const detectedHost = headers.get("x-forwarded-host") ?? headers.get("host");
    const detectedProtocol = ctx.headers["x-forwarded-proto"] ? (Array.isArray(ctx.headers["x-forwarded-proto"]) ? ctx.headers["x-forwarded-proto"][0] : ctx.headers["x-forwarded-proto"]).split(",")[0] : ctx.protocol.split(",")[0];
    const _protocol = detectedProtocol.endsWith(":") ? detectedProtocol : detectedProtocol + ":";

    const query = ctx.href.split("?")[1];
    const url = envUrl ? new URL(envUrl) : new URL(`${_protocol}//${detectedHost}${basePath}${ctx.path}${query ? `?${query}` : ""}`);

    // GET and HEAD not allowed to receive body
    const body = /GET|HEAD/.test(ctx.method) ? undefined : encodeRequestBody(ctx.request);

    console.log("URL", url);
    console.log("ctx.query", ctx.query);
    console.log("ctx.request.query", ctx.request.query);
    console.log("ctx.request.body", ctx.request.body);

    return new Request(url, {
        method: ctx.method,
        headers: headers,
        body: body,
    });
}

/**
 * Adapts a Web Response to an Koa Response, invoking appropriate
 * Koa response methods to handle the response.
 * @param res The Web Response
 * @param ctx The Koa Context
 */
export async function toKoaResponse(res: Response, ctx: k.ParameterizedContext<k.DefaultState, k.DefaultContext>) {
    // Set headers
    res.headers.forEach((value, key) => {
        if (value) {
            ctx.set(key, value);
        }
    });

    // Set status and status text
    ctx.status = res.status;
    ctx.message = res.statusText;

    // Explicitly write the headers to the content type
    ctx.type = res.headers.get("content-type") ?? "";

    // Set the response body
    ctx.body = await res.text();
}
