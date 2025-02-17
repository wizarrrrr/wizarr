import { URLSearchParams } from "url";

import { Playable } from "./base/playable";
import { fetchItems } from "./baseFunctionality";
import { BadRequest, NotFound } from "./exceptions";
import type { Section } from "./library";
import { PlaylistResponse } from "./playlist.types";
import type { PlexServer } from "./server";
import { Episode, Movie, VideoType } from "./video";

/**
 * Map media types to their respective class
 */
function contentClass(data: any) {
    switch (data.type) {
        case "episode":
            return Episode;
        case "movie":
            return Movie;
        default:
            throw new Error("Media type not implemented");
    }
}

interface CreateRegularPlaylistOptions {
    /** True to create a smart playlist */
    smart?: false;
    /** Regular playlists only */
    items?: VideoType[];
}

interface CreateSmartPlaylistOptions {
    /** True to create a smart playlist */
    smart: true;
    /** Smart playlists only, the library section to create the playlist in. */
    section?: Section;
    /** Smart playlists only, limit the number of items in the playlist. */
    limit?: number;
    /**
     * Smart playlists only, a string of comma separated sort fields
     * or a list of sort fields in the format ``column:dir``.
     * See {@link Section.search}  for more info.
     */
    sort?: string;
    /**
     * Smart playlists only, a dictionary of advanced filters.
     * See {@link Section.search}  for more info.
     */
    filters?: Record<string, any>;
}

type CreatePlaylistOptions = CreateRegularPlaylistOptions | CreateSmartPlaylistOptions;
type PlaylistContent = Episode | Movie;

export class Playlist extends Playable {
    static override TAG = "Playlist";

    static async create(server: PlexServer, title: string, options: CreatePlaylistOptions) {
        if (options.smart) {
            throw new Error("not yet supported");
            // return this._createSmart(server, title, options);
        }

        return this._create(server, title, (options as any).items!);
    }

    /** Create a smart playlist. */
    // private static _createSmart(server: PlexServer, title: string, options: CreatePlaylistOptions) {}

    private static async _create(server: PlexServer, title: string, items: VideoType[]) {
        if (!items || items.length === 0) {
            throw new BadRequest("Must include items to add when creating new playlist.");
        }

        const { listType } = items[0];
        const ratingKeys = items ? items.map((x) => x.ratingKey) : [];
        const uri = `${server._uriRoot()}/library/metadata/${ratingKeys.join(",")}`;
        const params = new URLSearchParams({
            uri,
            type: listType,
            title,
            smart: "0",
        });
        const key = `/playlists?${params.toString()}`;
        const data = await server.query(key, "post");
        return new Playlist(server, data.MediaContainer.Metadata[0], key);
    }

    TYPE = "playlist";

    addedAt!: Date;
    updatedAt!: Date;
    composite!: string;
    guid!: string;
    leafCount!: number;
    playlistType!: string;
    smart!: boolean;
    summary!: string;
    allowSync?: boolean;
    duration?: number;
    durationInSeconds?: number;
    /** Cache of playlist items */
    private _items: PlaylistContent[] | null = null;

    async _edit(args: { title?: string; summary?: string }) {
        const searchparams = new URLSearchParams(args);
        const key = `${this.key}?${searchparams.toString()}`;
        await this.server.query(key, "put");
    }

    override async edit(changeObj: { title?: string; summary?: string }) {
        await this._edit(changeObj);
    }

    /**
     * @returns the item in the playlist that matches the specified title.
     */
    async item(title: string): Promise<PlaylistContent | null> {
        const items = await this.items();
        const matched = items.find((item) => item.title!.toLowerCase() === title.toLowerCase());
        return matched ?? null;
    }

    async items() {
        if (this._items === null) {
            const key = `/playlists/${this.ratingKey}/items`;
            const items = await fetchItems(this.server, key);
            this._items = items.map((data) => {
                const Cls = contentClass(data);
                return new Cls(this.server, data, key, this);
            });
        }

        return this._items;
    }

    /** Add items to a playlist. */
    async addItems(items: PlaylistContent[]) {
        if (this.smart) {
            throw new BadRequest("Cannot add items to a smart playlist.");
        }

        const isInvalidType = items.some((x) => x.listType !== this.playlistType);
        if (isInvalidType) {
            throw new BadRequest("Can not mix media types when building a playlist");
        }

        const ratingKeys = items.map((x) => x.ratingKey);
        const params = new URLSearchParams({
            uri: `${this.server._uriRoot()}/library/metadata/${ratingKeys.join(",")}`,
        });

        const key = `${this.key}/items?${params.toString()}`;
        await this.server.query(key, "put");
    }

    /** Remove an item from a playlist. */
    async removeItems(items: PlaylistContent[]) {
        if (this.smart) {
            throw new BadRequest("Cannot remove items to a smart playlist.");
        }

        for (const item of items) {
            // eslint-disable-next-line no-await-in-loop
            const playlistItemId = await this._getPlaylistItemID(item);
            const key = `${this.key}/items/${playlistItemId}`;
            // eslint-disable-next-line no-await-in-loop
            await this.server.query(key, "delete");
        }
    }

    /** Delete the playlist. */
    override async delete() {
        await this.server.query(this.key, "delete");
    }

    protected _loadData(data: PlaylistResponse) {
        this.key = data.key.replace("/items", "");
        this.ratingKey = data.ratingKey;
        this.title = data.title;
        this.type = data.type;
        this.addedAt = new Date(data.addedAt);
        this.updatedAt = new Date(data.updatedAt);
        this.composite = data.composite;
        this.guid = data.guid;
        this.playlistType = data.playlistType;
        this.summary = data.summary;
        this.smart = data.smart;
        this.leafCount = data.leafCount;

        // TODO: verify these. Possibly audio playlist related
        this.allowSync = data.allowSync;
        this.duration = data.duration;
        this.durationInSeconds = data.durationInSeconds;
    }

    protected _loadFullData(data: any) {
        this._loadData(data.Metadata[0]);
    }

    private async _getPlaylistItemID(item: PlaylistContent) {
        const items = await this.items();
        const playlistItem = items.find((i) => i.ratingKey === item.ratingKey);
        if (!playlistItem) {
            throw new NotFound(`Item with title "${item.title}" not found in the playlist`);
        }

        return playlistItem.playlistItemID;
    }
}
