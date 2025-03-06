import * as k from "koa";

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
function encodeRequestBody(req: k.Request): BodyInit {
    const contentType = req.headers["content-type"];

    if (contentType?.includes("application/x-www-form-urlencoded")) {
        return encodeUrlEncoded(req.body as Record<string, unknown>);
    }

    if (contentType?.includes("application/json")) {
        return encodeJson(req.body as Record<string, unknown>);
    }

    return req.body as BodyInit;
}

/**
 * Adapts an Koa Request to a Web Request, returning the Web Request.
 * @param req The Koa Request
 * @returns The Web Request
 */
export function toWebRequest(req: k.Request) {
    const url = "https://" + req.get("host") + req.originalUrl;

    const headers = new Headers();

    Object.entries(req.headers).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v) => v && headers.append(key, v));
            return;
        }

        if (value) {
            headers.append(key, value);
        }
    });

    // GET and HEAD not allowed to receive body
    const body = /GET|HEAD/.test(req.method) ? undefined : encodeRequestBody(req);

    const request = new Request(url, {
        method: req.method,
        headers: headers,
        body: body,
    });

    return request;
}

/**
 * Adapts a Web Response to an Koa Response, invoking appropriate
 * Koa response methods to handle the response.
 * @param res The Web Response
 * @param ctx The Koa Context
 */
export async function toKoaResponse(res: Response, ctx: k.Context) {
    // Set headers
    res.headers.forEach((value, key) => {
        if (value) {
            ctx.set(key, value);
        }
    });

    // Set status and status text
    ctx.status = res.status;
    ctx.message = res.statusText;

    // Set the response body
    ctx.body = await res.text();
}
