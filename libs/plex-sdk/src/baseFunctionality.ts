import type { PlexServer } from "./server";
import { MediaContainer } from "./util";

export const OPERATORS = {
    exact: (v: string | number, q: string | number) => v === q,
    iexact: (v: string, q: string) => v.toLowerCase() === q.toLowerCase(),
    contains: (v: string, q: string) => q.includes(v),
    icontains: (v: string, q: string) => q.toLowerCase().includes(v.toLowerCase()),
    ne: (v: string, q: string) => v !== q,
    in: (v: string, q: any) => v in q,
    gt: (v: number, q: number) => v > q,
    gte: (v: number, q: number) => v >= q,
    lt: (v: number, q: number) => v < q,
    lte: (v: number, q: number) => v <= q,
    startswith: (v: string, q: string) => v.startsWith(q),
    istartswith: (v: string, q: string) => v.toLowerCase().startsWith(q),
    endswith: (v: string, q: string) => v.endsWith(q),
    iendswith: (v: string, q: string) => v.toLowerCase().endsWith(q),
    // 'exists': (v: string, q) => v is not None if q else v is None,
    // 'regex': (v: string, q) => re.match(q, v),
    // 'iregex': (v: string, q) => re.match(q, v, flags=re.IGNORECASE),
} as const;

/**
 * Load the specified key to find and build the first item with the
 * specified tag and attrs. If no tag or attrs are specified then
 * the first item in the result set is returned.
 *
 * @param ekey Path in Plex to fetch items from. If an int is passed
 * in, the key will be translated to /library/metadata/<key>. This allows
 * fetching an item only knowing its key-id.
 */
export async function fetchItem(server: PlexServer, ekey: string | number, options?: Record<string, string | number>, cls?: any): Promise<any> {
    const key = typeof ekey === "number" ? `/library/metadata/${ekey.toString()}` : ekey;
    const response = await server.query<MediaContainer<any>>(key);
    const containerKey = cls?.TAG ?? "Metadata";
    const elems = response.MediaContainer[containerKey] ?? [];
    for (const elem of elems) {
        if (checkAttrs(elem, options)) {
            return elem;
        }
    }

    throw new Error("Unable to find item");
}

/**
 * Load the specified key to find and build all items with the specified tag
 * and attrs. See :func:`~plexapi.base.PlexObject.fetchItem` for more details
 * on how this is used.
 */
export async function fetchItems<T = any>(server: PlexServer, ekey: string, options?: Record<string, string | number>, Cls?: any, parent?: any): Promise<T[]> {
    const response = await server.query<MediaContainer<any>>(ekey);
    const { MediaContainer } = response;
    const elems = MediaContainer[Cls?.TAG] ?? MediaContainer.Metadata ?? [];
    const items = findItems(elems, options, Cls, server, parent);
    return items;
}

/**
 * Load the specified data to find and build all items with the specified tag
 * and attrs. See :func:`~plexapi.base.PlexObject.fetchItem` for more details
 * on how this is used.
 */
export function findItems(data: any[], options: Record<string, string | number> = {}, Cls?: any, server?: PlexServer, parent?: any): any[] {
    // if (Cls?.TAG && !('tag' in options)) {
    //   options.etag = Cls.TAG;
    // }

    // if (Cls?.TYPE && !('type' in options)) {
    //   options.type = Cls.TYPE;
    // }

    const items: any[] = [];
    for (const elem of data) {
        if (checkAttrs(elem, options)) {
            items.push(Cls === undefined ? elem : new Cls(server, elem, undefined, parent));
        }
    }

    return items;
}

function checkAttrs<T>(elem: T, obj: Record<string, string | number> = {}): boolean {
    const attrsFound: Record<string, boolean> = {};
    for (const [attr, query] of Object.entries(obj)) {
        const [key, , operator] = getAttrOperator(attr);
        const value = (elem as any)[key] as string;
        attrsFound[key] = operator(value, query);
    }

    return Object.values(attrsFound).every((x) => x);
}

function getAttrOperator(attr: string): [string, keyof typeof OPERATORS, (a: any, b: any) => boolean] {
    // OPERATORS
    for (const [op, operator] of Object.entries(OPERATORS)) {
        if (attr.endsWith(`__${op}`)) {
            const key = attr.split("__", 1)[0];
            return [key, op as keyof typeof OPERATORS, operator];
        }
    }

    return [attr, "exact", OPERATORS.exact];
}
