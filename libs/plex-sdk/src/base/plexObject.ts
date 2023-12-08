import { URLSearchParams } from "url";

import type { PlexServer } from "../server.js";

class WeakRef<T> {
    constructor(public readonly target: T) {}

    deref(): T {
        return this.target;
    }
}

/**
 * Base class for all? Plex objects
 */
export abstract class PlexObject {
    /** xml element tag */
    static TAG: string | null = null;
    /** xml element type */
    static TYPE: string | null = null;
    /** plex relative url */
    key!: string;
    /**
     * WeakRef to the parent object that this object is built from.
     */
    readonly parent?: WeakRef<any>;
    protected _detailsKey: string;
    protected initpath: string;
    protected _INCLUDES?: Record<string, string | number>;

    constructor(
        public readonly server: PlexServer,
        data: any,
        initpath?: string,
        parent?: PlexObject,
    ) {
        this.initpath = initpath ?? this.key;
        this.parent = parent ? new WeakRef(parent) : undefined;
        this._loadData(data);
        this._detailsKey = this._buildDetailsKey();
    }

    /**
     * Reload the data for this object from this.key.
     */
    async reload(ekey?: string): Promise<void> {
        const key = ekey ?? this._detailsKey ?? this.key;
        if (!key) {
            throw new Error("Cannot reload an object not built from a URL");
        }

        const data = await this.server.query(key);
        const innerData = data.MediaContainer ? data.MediaContainer : data;
        this._loadData(innerData);
    }

    /**
     * Refreshing a Library or individual item causes the metadata for the item to be
     * refreshed, even if it already has metadata. You can think of refreshing as
     * "update metadata for the requested item even if it already has some". You should
     * refresh a Library or individual item if:
     */
    async refresh() {
        const key = `${this.key}/refresh`;
        await this.server.query(key, "put");
    }

    /**
     * Returns True if this object is a child of the given class.
     */
    isChildOf(cls: any): boolean {
        const parent = this.parent?.deref();
        return (parent && parent.constructor === cls.constructor) || false;
    }

    protected _buildDetailsKey(args: Record<string, boolean | number> = {}) {
        let detailsKey = this.key;
        if (detailsKey && this._INCLUDES !== undefined) {
            const params = new URLSearchParams();
            for (const [k, v] of Object.entries(this._INCLUDES)) {
                const value = args[k] ?? v;
                if (![false, 0, "0"].includes(value)) {
                    params.set(k, (value === true ? 1 : value).toString());
                }
            }

            if ([...params.keys()].length) {
                detailsKey += "?" + params.toString();
            }
        }

        return detailsKey;
    }

    protected abstract _loadData(data: any): void;
}
