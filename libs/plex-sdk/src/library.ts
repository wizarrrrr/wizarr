import { URLSearchParams } from "url";

import { Class } from "type-fest";

import { PartialPlexObject } from "./base/partialPlexObject";
import { PlexObject } from "./base/plexObject";
import { fetchItem, fetchItems, findItems } from "./baseFunctionality";
import { NotFound } from "./exceptions";
import { CollectionData, LibraryRootResponse, Location, SectionsDirectory, SectionsResponse } from "./library.types";
import { Playlist } from "./playlist";
import { Agent, searchType, SEARCHTYPES } from "./search";
import { SearchResult } from "./search.types";
import type { PlexServer } from "./server";
import { MediaContainer } from "./util";
import { Movie, Show, VideoType } from "./video";

export type Section = MovieSection | ShowSection;

export class Library {
    static key = "/library";
    /** Unknown ('com.plexapp.plugins.library') */
    identifier!: string;
    /** Unknown (/system/bundle/media/flags/) */
    mediaTagPrefix!: string;
    /** 'Plex Library' (not sure how useful this is) */
    title1!: string;
    /** Second title (this is blank on my setup) */
    title2!: string;

    constructor(
        private readonly server: PlexServer,
        data: LibraryRootResponse,
    ) {
        this._loadData(data);
    }

    /**
     * @returns a list of all media sections in this library. Library sections may be any of
     */
    async sections(): Promise<Section[]> {
        const key = "/library/sections";
        const elems = await this.server.query<MediaContainer<SectionsResponse>>(key);
        const sections: Section[] = [];
        for (const elem of elems.MediaContainer.Directory) {
            for (const cls of [MovieSection, ShowSection]) {
                if (cls.TYPE === elem.type) {
                    // eslint-disable-next-line new-cap
                    const instance = new cls(this.server, elem, key);
                    sections.push(instance);
                }
            }
        }

        return sections;
    }

    async section<T extends Section = Section>(title: string): Promise<T> {
        const sections = await this.sections();
        const section = sections.find((s) => s.title.toLowerCase() === title.toLowerCase()) as T | undefined;
        if (!section) {
            const avilableSections = sections.map((s) => s.title).join(", ");
            throw new Error(`Invalid library section: ${title}. Available: ${avilableSections}`);
        }

        return section;
    }

    async sectionByID(sectionId: string | number): Promise<Section> {
        const sections = await this.sections();
        const section = sections.find((s) => s.key);
        if (!section) {
            throw new Error(`Invalid library section id: ${sectionId}`);
        }

        return section;
    }

    /**
     * Simplified add for the most common options.
     *
     * Parameters:
     *     name (str): Name of the library
     *     agent (str): Example com.plexapp.agents.imdb
     *     type (str): movie, show, # check me
     *     location (str): /path/to/files
     *     language (str): Two letter language fx en
     *     kwargs (dict): Advanced options should be passed as a dict. where the id is the key.
     *
     * **Photo Preferences**
     *
     *     * **agent** (str): com.plexapp.agents.none
     *     * **enableAutoPhotoTags** (bool): Tag photos. Default value false.
     *     * **enableBIFGeneration** (bool): Enable video preview thumbnails. Default value true.
     *     * **includeInGlobal** (bool): Include in dashboard. Default value true.
     *     * **scanner** (str): Plex Photo Scanner
     *
     * **Movie Preferences**
     *
     *     * **agent** (str): com.plexapp.agents.none, com.plexapp.agents.imdb, com.plexapp.agents.themoviedb
     *     * **enableBIFGeneration** (bool): Enable video preview thumbnails. Default value true.
     *     * **enableCinemaTrailers** (bool): Enable Cinema Trailers. Default value true.
     *     * **includeInGlobal** (bool): Include in dashboard. Default value true.
     *     * **scanner** (str): Plex Movie Scanner, Plex Video Files Scanner
     *
     * **IMDB Movie Options** (com.plexapp.agents.imdb)
     *
     *     * **title** (bool): Localized titles. Default value false.
     *     * **extras** (bool): Find trailers and extras automatically (Plex Pass required). Default value true.
     *     * **only_trailers** (bool): Skip extras which aren't trailers. Default value false.
     *     * **redband** (bool): Use red band (restricted audiences) trailers when available. Default value false.
     *     * **native_subs** (bool): Include extras with subtitles in Library language. Default value false.
     *     * **cast_list** (int): Cast List Source: Default value 1 Possible options: 0:IMDb,1:The Movie Database.
     *     * **ratings** (int): Ratings Source, Default value 0 Possible options:
     *       0:Rotten Tomatoes, 1:IMDb, 2:The Movie Database.
     *     * **summary** (int): Plot Summary Source: Default value 1 Possible options: 0:IMDb,1:The Movie Database.
     *     * **country** (int): Default value 46 Possible options 0:Argentina, 1:Australia, 2:Austria,
     *       3:Belgium, 4:Belize, 5:Bolivia, 6:Brazil, 7:Canada, 8:Chile, 9:Colombia, 10:Costa Rica,
     *       11:Czech Republic, 12:Denmark, 13:Dominican Republic, 14:Ecuador, 15:El Salvador,
     *       16:France, 17:Germany, 18:Guatemala, 19:Honduras, 20:Hong Kong SAR, 21:Ireland,
     *       22:Italy, 23:Jamaica, 24:Korea, 25:Liechtenstein, 26:Luxembourg, 27:Mexico, 28:Netherlands,
     *       29:New Zealand, 30:Nicaragua, 31:Panama, 32:Paraguay, 33:Peru, 34:Portugal,
     *       35:Peoples Republic of China, 36:Puerto Rico, 37:Russia, 38:Singapore, 39:South Africa,
     *       40:Spain, 41:Sweden, 42:Switzerland, 43:Taiwan, 44:Trinidad, 45:United Kingdom,
     *       46:United States, 47:Uruguay, 48:Venezuela.
     *     * **collections** (bool): Use collection info from The Movie Database. Default value false.
     *     * **localart** (bool): Prefer artwork based on library language. Default value true.
     *     * **adult** (bool): Include adult content. Default value false.
     *     * **usage** (bool): Send anonymous usage data to Plex. Default value true.
     *
     * **TheMovieDB Movie Options** (com.plexapp.agents.themoviedb)
     *
     *     * **collections** (bool): Use collection info from The Movie Database. Default value false.
     *     * **localart** (bool): Prefer artwork based on library language. Default value true.
     *     * **adult** (bool): Include adult content. Default value false.
     *     * **country** (int): Country (used for release date and content rating). Default value 47 Possible
     *       options 0:, 1:Argentina, 2:Australia, 3:Austria, 4:Belgium, 5:Belize, 6:Bolivia, 7:Brazil, 8:Canada,
     *       9:Chile, 10:Colombia, 11:Costa Rica, 12:Czech Republic, 13:Denmark, 14:Dominican Republic, 15:Ecuador,
     *       16:El Salvador, 17:France, 18:Germany, 19:Guatemala, 20:Honduras, 21:Hong Kong SAR, 22:Ireland,
     *       23:Italy, 24:Jamaica, 25:Korea, 26:Liechtenstein, 27:Luxembourg, 28:Mexico, 29:Netherlands,
     *       30:New Zealand, 31:Nicaragua, 32:Panama, 33:Paraguay, 34:Peru, 35:Portugal,
     *       36:Peoples Republic of China, 37:Puerto Rico, 38:Russia, 39:Singapore, 40:South Africa, 41:Spain,
     *       42:Sweden, 43:Switzerland, 44:Taiwan, 45:Trinidad, 46:United Kingdom, 47:United States, 48:Uruguay,
     *       49:Venezuela.
     *
     * **Show Preferences**
     *
     *     * **agent** (str): com.plexapp.agents.none, com.plexapp.agents.thetvdb, com.plexapp.agents.themoviedb
     *     * **enableBIFGeneration** (bool): Enable video preview thumbnails. Default value true.
     *     * **episodeSort** (int): Episode order. Default -1 Possible options: 0:Oldest first, 1:Newest first.
     *     * **flattenSeasons** (int): Seasons. Default value 0 Possible options: 0:Show,1:Hide.
     *     * **includeInGlobal** (bool): Include in dashboard. Default value true.
     *     * **scanner** (str): Plex Series Scanner
     *
     * **TheTVDB Show Options** (com.plexapp.agents.thetvdb)
     *
     *     * **extras** (bool): Find trailers and extras automatically (Plex Pass required). Default value true.
     *     * **native_subs** (bool): Include extras with subtitles in Library language. Default value false.
     *
     * **TheMovieDB Show Options** (com.plexapp.agents.themoviedb)
     *
     *     * **collections** (bool): Use collection info from The Movie Database. Default value false.
     *     * **localart** (bool): Prefer artwork based on library language. Default value true.
     *     * **adult** (bool): Include adult content. Default value false.
     *     * **country** (int): Country (used for release date and content rating). Default value 47 options
     *       0:, 1:Argentina, 2:Australia, 3:Austria, 4:Belgium, 5:Belize, 6:Bolivia, 7:Brazil, 8:Canada, 9:Chile,
     *       10:Colombia, 11:Costa Rica, 12:Czech Republic, 13:Denmark, 14:Dominican Republic, 15:Ecuador,
     *       16:El Salvador, 17:France, 18:Germany, 19:Guatemala, 20:Honduras, 21:Hong Kong SAR, 22:Ireland,
     *       23:Italy, 24:Jamaica, 25:Korea, 26:Liechtenstein, 27:Luxembourg, 28:Mexico, 29:Netherlands,
     *       30:New Zealand, 31:Nicaragua, 32:Panama, 33:Paraguay, 34:Peru, 35:Portugal,
     *       36:Peoples Republic of China, 37:Puerto Rico, 38:Russia, 39:Singapore, 40:South Africa,
     *       41:Spain, 42:Sweden, 43:Switzerland, 44:Taiwan, 45:Trinidad, 46:United Kingdom, 47:United States,
     *       48:Uruguay, 49:Venezuela.
     *
     * **Other Video Preferences**
     *
     *     * **agent** (str): com.plexapp.agents.none, com.plexapp.agents.imdb, com.plexapp.agents.themoviedb
     *     * **enableBIFGeneration** (bool): Enable video preview thumbnails. Default value true.
     *     * **enableCinemaTrailers** (bool): Enable Cinema Trailers. Default value true.
     *     * **includeInGlobal** (bool): Include in dashboard. Default value true.
     *     * **scanner** (str): Plex Movie Scanner, Plex Video Files Scanner
     *
     * **IMDB Other Video Options** (com.plexapp.agents.imdb)
     *
     *     * **title** (bool): Localized titles. Default value false.
     *     * **extras** (bool): Find trailers and extras automatically (Plex Pass required). Default value true.
     *     * **only_trailers** (bool): Skip extras which aren't trailers. Default value false.
     *     * **redband** (bool): Use red band (restricted audiences) trailers when available. Default value false.
     *     * **native_subs** (bool): Include extras with subtitles in Library language. Default value false.
     *     * **cast_list** (int): Cast List Source: Default value 1 Possible options: 0:IMDb,1:The Movie Database.
     *     * **ratings** (int): Ratings Source Default value 0 Possible options:
     *       0:Rotten Tomatoes,1:IMDb,2:The Movie Database.
     *     * **summary** (int): Plot Summary Source: Default value 1 Possible options: 0:IMDb,1:The Movie Database.
     *     * **country** (int): Country: Default value 46 Possible options: 0:Argentina, 1:Australia, 2:Austria,
     *       3:Belgium, 4:Belize, 5:Bolivia, 6:Brazil, 7:Canada, 8:Chile, 9:Colombia, 10:Costa Rica,
     *       11:Czech Republic, 12:Denmark, 13:Dominican Republic, 14:Ecuador, 15:El Salvador, 16:France,
     *       17:Germany, 18:Guatemala, 19:Honduras, 20:Hong Kong SAR, 21:Ireland, 22:Italy, 23:Jamaica,
     *       24:Korea, 25:Liechtenstein, 26:Luxembourg, 27:Mexico, 28:Netherlands, 29:New Zealand, 30:Nicaragua,
     *       31:Panama, 32:Paraguay, 33:Peru, 34:Portugal, 35:Peoples Republic of China, 36:Puerto Rico,
     *       37:Russia, 38:Singapore, 39:South Africa, 40:Spain, 41:Sweden, 42:Switzerland, 43:Taiwan, 44:Trinidad,
     *       45:United Kingdom, 46:United States, 47:Uruguay, 48:Venezuela.
     *     * **collections** (bool): Use collection info from The Movie Database. Default value false.
     *     * **localart** (bool): Prefer artwork based on library language. Default value true.
     *     * **adult** (bool): Include adult content. Default value false.
     *     * **usage** (bool): Send anonymous usage data to Plex. Default value true.
     *
     * **TheMovieDB Other Video Options** (com.plexapp.agents.themoviedb)
     *
     *     * **collections** (bool): Use collection info from The Movie Database. Default value false.
     *     * **localart** (bool): Prefer artwork based on library language. Default value true.
     *     * **adult** (bool): Include adult content. Default value false.
     *     * **country** (int): Country (used for release date and content rating). Default
     *       value 47 Possible options 0:, 1:Argentina, 2:Australia, 3:Austria, 4:Belgium, 5:Belize,
     *       6:Bolivia, 7:Brazil, 8:Canada, 9:Chile, 10:Colombia, 11:Costa Rica, 12:Czech Republic,
     *       13:Denmark, 14:Dominican Republic, 15:Ecuador, 16:El Salvador, 17:France, 18:Germany,
     *       19:Guatemala, 20:Honduras, 21:Hong Kong SAR, 22:Ireland, 23:Italy, 24:Jamaica,
     *       25:Korea, 26:Liechtenstein, 27:Luxembourg, 28:Mexico, 29:Netherlands, 30:New Zealand,
     *       31:Nicaragua, 32:Panama, 33:Paraguay, 34:Peru, 35:Portugal,
     *       36:Peoples Republic of China, 37:Puerto Rico, 38:Russia, 39:Singapore,
     *       40:South Africa, 41:Spain, 42:Sweden, 43:Switzerland, 44:Taiwan, 45:Trinidad,
     *       46:United Kingdom, 47:United States, 48:Uruguay, 49:Venezuela.
     */
    async add(name: string, type: string, agent: string, scanner: string, location: string, language = "en", extra: Record<string, string> = {}) {
        const search = new URLSearchParams({
            name,
            type,
            agent,
            scanner,
            location,
            language,
            ...extra,
        });
        const url = "/library/sections?" + search.toString();
        return this.server.query(url, "post");
    }

    /**
     * Returns a list of all media from all library sections.
     * This may be a very large dataset to retrieve.
     */
    async all() {
        const results: any[] = [];
        const sections = await this.sections();
        for (const section of sections) {
            // eslint-disable-next-line no-await-in-loop
            const items = await section.all();
            for (const item of items) {
                results.push(item);
            }
        }

        return results;
    }

    /**
     * If a library has items in the Library Trash, use this option to empty the Trash.
     */
    async emptyTrash() {
        const sections = await this.sections();
        for (const section of sections) {
            // eslint-disable-next-line no-await-in-loop
            await section.emptyTrash();
        }
    }

    /**
     * The Optimize option cleans up the server database from unused or fragmented data.
     * For example, if you have deleted or added an entire library or many items in a
     * library, you may like to optimize the database.
     */
    async optimize() {
        await this.server.query("/library/optimize?async=1", "put");
    }

    /**
     * Validates a filter field and values are available as a custom filter for the library.
     * Returns the validated field and values as a URL encoded parameter string.
     */
    // _validateFilterField(field: string): string {
    //   const match = /(?:([a-zA-Z]*)\.)?([a-zA-Z]+)([!<>=&]*)/.test(field);
    //   if (!match) {
    //     throw new Error('Invalid filter field: ' + field);
    //   }
    // }

    /**
     * Returns the validated and formatted search query API key
     * (``/library/sections/<sectionKey>/all?<params>``).
     */
    // _buildSearchKey(kwargs: Record<string, string>) {
    //   const args: Record<string, string> = {};
    //   const filterArgs = [];
    //   for (const [field, values] of Object.entries(kwargs)) {
    //     if (!(field.split('__')[-1] in OPERATORS)) {
    //       filterArgs.push(this._validateFilterField(field, values, libtype));
    //       delete kwargs[field];
    //     }
    //   }
    // }

    protected _loadData(data: LibraryRootResponse): void {
        this.identifier = data.identifier;
        this.mediaTagPrefix = data.mediaTagPrefix;
        this.title1 = data.title1;
        this.title2 = data.title2;
    }
}

type Libtype = keyof typeof SEARCHTYPES;

interface SearchArgs {
    [key: string]: number | string | boolean | string[];
    /** General string query to search for. Partial string matches are allowed. */
    title: string;
    /** A string of comma separated sort fields or a list of sort fields in the format ``column:dir``. */
    sort: string | string[];
    /** Only return the specified number of results. */
    maxresults: number;
    /** Default 0 */
    container_start: number;
    /** Default 100 (X_PLEX_CONTAINER_SIZE) */
    container_size: number;
    /** Limit the number of results from the filter. */
    limit: number;
    /**
     * Return results of a specific type (movie, show, season, episode,
     * artist, album, track, photoalbum, photo, collection) (e.g. ``libtype='movie'`` will only
     * return {@link Movie} objects)
     */
    libtype: Libtype;
}

/**
 * Base class for a single library section.
 */
export abstract class LibrarySection<SectionVideoType = VideoType> extends PlexObject {
    static ALLOWED_FILTERS: string[] = [];
    static ALLOWED_SORT: string[] = [];
    static BOOLEAN_FILTERS = ["unwatched", "duplicate"];
    /** Unknown (com.plexapp.agents.imdb, etc) */
    agent!: string;
    /** l True if you allow syncing content from this section. */
    allowSync!: boolean;
    /** Wallpaper artwork used to respresent this section. */
    art!: string;
    /** Composit image used to represent this section. */
    composite!: string;
    /** Unknown */
    filters!: boolean;
    /** Language represented in this section (en, xn, etc). */
    language!: string;
    /** Paths on disk where section content is stored. */
    locations!: Location[];
    /** True if this section is currently being refreshed. */
    refreshing!: boolean;
    /** Internal scanner used to find media (Plex Movie Scanner, Plex Premium Music Scanner, etc.) */
    scanner!: string;
    /** Thumbnail image used to represent this section. */
    thumb!: string;
    /** Title of this section. */
    title!: string;
    /** Type of content section represents (movie, artist, photo, show). */
    type!: "movie" | "show";
    /** Datetime this library section was last updated. */
    updatedAt!: Date;
    /** Datetime this library section was created. */
    createdAt!: Date;
    scannedAt!: Date;
    /** Unique id for this section (32258d7c-3e6c-4ac5-98ad-bad7a3b78c63) */
    uuid!: string;
    CONTENT_TYPE!: string;
    readonly VIDEO_TYPE!: Class<SectionVideoType>;

    _filterTypes?: FilteringType[];
    _fieldTypes?: FilteringFieldType[];

    async all(sort = "") {
        let sortStr = "";
        if (sort) {
            sortStr = `?sort=${sort}`;
        }

        const key = `/library/sections/${this.key}/all${sortStr}`;
        const items = await fetchItems(this.server, key);
        return items;
    }

    async agents(): Promise<Agent[]> {
        return this.server.agents(searchType(this.type));
    }

    /**
     * @param title Title of the item to return.
     * @returns the media item with the specified title.
     */
    async get(title: string): Promise<SectionVideoType> {
        const key = `/library/sections/${this.key}/all?includeGuids=1&title=${title}`;
        const data = await fetchItem(this.server, key, { title__iexact: title });
        return new this.VIDEO_TYPE(this.server, data, key, this);
    }

    /**
     * Returns the media item with the specified external IMDB, TMDB, or TVDB ID.
     * Note: This search uses a PlexAPI operator so performance may be slow. All items from the
     * entire Plex library need to be retrieved for each guid search. It is recommended to create
     * your own lookup dictionary if you are searching for a lot of external guids.
     *
     * @param guid The external guid of the item to return.
     *  Examples: IMDB ``imdb://tt0944947``, TMDB ``tmdb://1399``, TVDB ``tvdb://121361``.
     *
     *
     * Example:
     *
     * 		.. code-block:: python
     *
     * 				# This will retrieve all items in the entire library 3 times
     * 				result1 = library.getGuid('imdb://tt0944947')
     * 				result2 = library.getGuid('tmdb://1399')
     * 				result3 = library.getGuid('tvdb://121361')
     *
     * 				# This will only retrieve all items in the library once to create a lookup dictionary
     * 				guidLookup = {guid.id: item for item in library.all() for guid in item.guids}
     * 				result1 = guidLookup['imdb://tt0944947']
     * 				result2 = guidLookup['tmdb://1399']
     * 				result3 = guidLookup['tvdb://121361']
     */
    async getGuid(guid: string): Promise<SectionVideoType> {
        const key = `/library/sections/${this.key}/all?includeGuids=1`;
        return fetchItem(this.server, key, { Guid__id__iexact: guid });
    }

    /**
     * Returns the Plex Web URL for the library.
     *
     * @param base The base URL before the fragment (``#!``).
     *    Default is https://app.plex.tv/desktop.
     * @param tab The library tab (recommended, library, collections, playlists, timeline).
     * @param key A hub key.
     */
    getWebURL(base?: string, tab?: string, key?: string): string {
        const params = new URLSearchParams();
        params.append("source", this.key);
        if (tab) {
            params.append("pivot", tab);
        }

        if (key) {
            params.append("key", key);
            params.append("pageType", "list");
        }

        return this.server._buildWebURL(base, undefined, params);
    }

    /**
     * Search the library. The http requests will be batched in container_size. If you are only looking for the
     * first <num> results, it would be wise to set the maxresults option to that amount so the search doesn't iterate
     * over all results on the server.
     *
     * Example: "studio=Comedy%20Central" or "year=1999" "title=Kung Fu" all work. Other items
     * such as actor=<id> seem to work, but require you already know the id of the actor.
     * TLDR: This is untested but seems to work. Use library section search when you can.
     * @param args Search using a number of different attributes
     */
    async search<T = SectionVideoType>(args: Partial<SearchArgs> = {}, Cls: any = this.VIDEO_TYPE): Promise<T[]> {
        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(args)) {
            let strValue: string;
            if (typeof value === "string") {
                strValue = value;
            } else if (typeof value === "boolean") {
                strValue = value ? "1" : "0";
            } else {
                strValue = JSON.stringify(value);
            }

            params.append(key, strValue);
        }

        if (args.libtype) {
            params.append("type", searchType(args.libtype).toString());
        }

        const key = `/library/sections/${this.key}/all?${params.toString()}`;
        const data = await fetchItems(this.server, key, undefined, Cls, this);
        return data;
    }

    /**
     * Run an analysis on all of the items in this library section.
     * See :func:`~plexapi.base.PlexPartialObject.analyze` for more details.
     */
    async analyze(): Promise<void> {
        const key = `/library/sections/${this.key}/analyze`;
        await this.server.query(key, "post");
    }

    /**
     * If a section has items in the Trash, use this option to empty the Trash
     */
    async emptyTrash(): Promise<void> {
        const key = `/library/sections/${this.key}/emptyTrash`;
        await this.server.query(key, "put");
    }

    /**
     * Get Play History for this library Section for the owner.
     * @param maxresults (int): Only return the specified number of results (optional).
     * @param mindate (datetime): Min datetime to return results from.
     */
    // async history(maxresults=9999999, mindate?: Date): Promise<any> {
    //   return this.server.history(maxresults=maxresults, mindate=mindate, librarySectionID=self.key, accountID=1)
    // }

    /**
     * Scan this section for new media.
     */
    async update(): Promise<void> {
        const key = `/library/sections/${this.key}/refresh`;
        await this.server.query(key);
    }

    /**
     * Cancel update of this Library Section.
     */
    async cancelUpdate(): Promise<void> {
        const key = `/library/sections/${this.key}/refresh`;
        await this.server.query(key, "delete");
    }

    /**
     * Forces a download of fresh media information from the internet.
     * This can take a long time. Any locked fields are not modified.
     */
    override async refresh(): Promise<void> {
        const key = `/library/sections/${this.key}/refresh?force=1`;
        await this.server.query(key);
    }

    /**
     * Delete the preview thumbnails for items in this library. This cannot
     * be undone. Recreating media preview files can take hours or even days.
     */
    async deleteMediaPreviews(): Promise<void> {
        const key = `/library/sections/${this.key}/indexes`;
        await this.server.query(key, "delete");
    }

    /** Delete a library section. */
    async delete(): Promise<void> {
        const key = `/library/sections/${this.key}`;
        await this.server.query(key, "delete");
    }

    /**
     * Edit a library
     * @param kwargs object of settings to edit
     */
    async edit(kwargs: Record<string, string>): Promise<Section> {
        const params = new URLSearchParams(kwargs);
        const part = `/library/sections/${this.key}?${params.toString()}`;
        await this.server.query(part, "put");
        const library = await this.server.library();
        const sections = await library.sections();
        for (const section of sections) {
            if (section.key === this.key) {
                return section;
            }
        }

        throw new Error("Couldn't update section");
    }

    async hubs(): Promise<Hub[]> {
        const key = `/hubs/sections/${this.key}`;
        const hubs = await fetchItems<Hub>(this.server, key, undefined, Hub, this);
        return hubs;
    }

    /**
     * Returns a list of playlists from this library section.
     */
    async playlists(): Promise<Playlist[]> {
        const key = `/playlists?type=15&playlistType=${this.CONTENT_TYPE}&sectionID=${this.key}`;
        return fetchItems<Playlist>(this.server, key, undefined, Playlist, this);
    }

    async collections(args: Record<string, number | string | boolean> = {}): Promise<Array<Collections<SectionVideoType>>> {
        const collections = await this.search<Collections<SectionVideoType>>({ ...args, libtype: "collection" }, Collections);
        collections.forEach((collection) => {
            collection.VIDEO_TYPE = this.VIDEO_TYPE;
        });
        return collections;
    }

    /**
     * Returns a list of available Folders for this library section.
     */
    async folders(): Promise<Folder[]> {
        const key = `/library/sections/${this.key}/folder`;
        return fetchItems<Folder>(this.server, key, undefined, Folder);
    }

    async genres(): Promise<FilterChoice[]> {
        const key = `/library/sections/${this.key}/genre`;
        return fetchItems<FilterChoice>(this.server, key, undefined, FilterChoice);
    }

    /**
     * Returns a list of available {@link FilteringFields} for a specified libtype.
     * This is the list of options in the custom filter dropdown menu
     */
    async listFields(libtype: Libtype = this.type) {
        return (await this.getFilterType(libtype)).fields;
    }

    async getFilterType(libtype: Libtype = this.type) {
        const filterTypes = await this.filterTypes();
        const filter = filterTypes!.find((f) => f.type === libtype);
        if (!filter) {
            throw new NotFound(
                `Unknown libtype "${libtype}" for this library.
        Available libtypes: ${filterTypes!.join(", ")}`,
            );
        }

        return filter;
    }

    /**
   * @param fieldType The data type for the field (tag, integer, string, boolean, date,
                    subtitleLanguage, audioLanguage, resolution).
   */
    async getFieldType(fieldType: string): Promise<FilteringFieldType> {
        const fieldTypes = await this.fieldTypes();
        const fType = fieldTypes!.find((f) => f.type === fieldType);

        if (!fType) {
            const availableFieldTypes = fieldTypes!.map((f) => f.type);
            throw new NotFound(`Unknown field type "${fieldType}" for this library. Available field types: ${availableFieldTypes.join(", ")}`);
        }

        return fType;
    }

    /**
     * @param libtype The library type to filter (movie, show, season, episode,
     *                 artist, album, track, photoalbum, photo, collection).
     *
     * @example
     * ```ts
     * const availableFilters = (await library.listFilters()).map(f => f.filter)
     * ```
     */
    async listFilters(libtype?: Libtype) {
        return (await this.getFilterType(libtype)).filters;
    }

    /**
     * @param fieldType The data type for the field (tag, integer, string, boolean, date,
     *                 subtitleLanguage, audioLanguage, resolution).
     */
    async listOperators(fieldType: string) {
        return (await this.getFieldType(fieldType)).operators;
    }

    async filterTypes() {
        if (this._filterTypes === null) {
            await this._loadFilters();
        }

        return this._filterTypes;
    }

    async fieldTypes() {
        if (this._fieldTypes === null) {
            await this._loadFilters();
        }

        return this._fieldTypes;
    }

    protected _loadData(data: SectionsDirectory): void {
        this.uuid = data.uuid;
        this.key = data.key;
        this.agent = data.agent;
        this.allowSync = data.allowSync;
        this.art = data.art;
        this.composite = data.composite;
        this.filters = data.filters;
        this.language = data.language;
        this.locations = data.Location;
        this.refreshing = data.refreshing;
        this.scanner = data.scanner;
        this.thumb = data.thumb;
        this.title = data.title;
        this.type = data.type as LibrarySection["type"];
        this.updatedAt = new Date(data.updatedAt * 1000);
        this.createdAt = new Date(data.createdAt * 1000);
        this.scannedAt = new Date(data.scannedAt * 1000);
    }

    private async _loadFilters() {
        const key = `/library/sections/${this.key}/all?includeMeta=1&includeAdvanced=1&X-Plex-Container-Start=0&X-Plex-Container-Size=0`;
        const data = await this.server.query(key);
        // rtag='Meta'
        this._filterTypes = findItems(data, undefined, FilteringType);
    }

    // /**
    //  * Validates a filter field and values are available as a custom filter for the library.
    //  * Returns the validated field and values as a URL encoded parameter string.
    //  */
    // private async _validateFilterField(field: string, libtype?: Libtype) {
    //   const match = /(?:([a-zA-Z]*)\.)?(?<field>[a-zA-Z]+)(?<operator>[!<>=&]*)/.exec(field);
    //   if (!match || !match.groups) {
    //     throw new BadRequest(`Invalid filter field: ${field}`);
    //   }

    //   const { libtype: _libtype, field: parsedField, operator: operatorMatch } = match.groups;
    //   libtype = (_libtype as Libtype) ?? libtype ?? this.type;
    //   const filterField = (await this.listFields(libtype)).find(
    //     f => f.key.split('.')[-1] === parsedField,
    //   );

    //   if (!filterField) {
    //     throw new NotFound('Unknown filter field');
    //   }

    //   field = filterField.key;
    //   const operator = await this._validateFieldOperator(filterField, operatorMatch);
    //   const result = this._validateFieldValue(filterField, values, libtype);

    //   if (operator === '&=') {
    //     const args = { [field]: result };
    //     return args;
    //   }

    //   return { [field + operator.slice(0, operator.length - 1)]: result.join(',') };
    // }

    // /**
    //  * Validates filter operator is in the available operators.
    //  * Returns the validated operator string.
    //  */
    // private async _validateFieldOperator(filterField: FilteringField, operator: string) {
    //   const fieldType = await this.getFieldType(filterField.type);

    //   let andOperator = false;
    //   if (['&', '&='].includes(operator)) {
    //     andOperator = true;
    //     operator = '';
    //   } else if (['=', '!='].includes(operator)) {
    //     operator += '=';
    //   }

    //   operator = operator.endsWith('=') ? operator.slice(0, operator.length - 1) : operator + '=';

    //   const exists = fieldType.operators.find(o => o.key === operator);
    //   if (!exists) {
    //     throw new NotFound('Unknown operator');
    //   }

    //   return andOperator ? '&=' : operator;
    // }

    // /**
    //  * Validates filter values are the correct datatype and in the available filter choices.
    //  * @returns the validated list of values.
    //  */
    // private async _validateFieldValue(filterField: FilteringField, values, libtype): Promise<any> {
    //   // todo
    // }
}

export class MovieSection extends LibrarySection<Movie> {
    static override TYPE = "movie";
    static override ALLOWED_FILTERS = ["unwatched", "duplicate", "year", "decade", "genre", "contentRating", "collection", "director", "actor", "country", "studio", "resolution", "guid", "label", "writer", "producer", "subtitleLanguage", "audioLanguage", "lastViewedAt", "viewCount", "addedAt"];

    static override ALLOWED_SORT = ["addedAt", "originallyAvailableAt", "lastViewedAt", "titleSort", "rating", "mediaHeight", "duration"];

    static override TAG = "Directory";
    METADATA_TYPE = "movie";
    override CONTENT_TYPE = "video";
    override readonly VIDEO_TYPE = Movie;
}

export class ShowSection extends LibrarySection<Show> {
    static override TYPE = "show";
    static override ALLOWED_FILTERS = ["unwatched", "year", "genre", "contentRating", "network", "collection", "guid", "duplicate", "label", "show.title", "show.year", "show.userRating", "show.viewCount", "show.lastViewedAt", "show.actor", "show.addedAt", "episode.title", "episode.originallyAvailableAt", "episode.resolution", "episode.subtitleLanguage", "episode.unwatched", "episode.addedAt", "episode.userRating", "episode.viewCount", "episode.lastViewedAt"];

    static override ALLOWED_SORT = ["addedAt", "lastViewedAt", "originallyAvailableAt", "titleSort", "rating", "unwatched"];

    static override TAG = "Directory";
    METADATA_TYPE = "episode";
    override CONTENT_TYPE = "video";
    override readonly VIDEO_TYPE = Show;

    // TODO: figure out how to return episode objects
    // /**
    //  * Search for an episode. See :func:`~plexapi.library.LibrarySection.search` for usage.
    //  */
    // async searchEpisodes(args: any) {
    //   return this.search({ libtype: 'episode', ...args });
    // }

    /**
     * Returns a list of recently added episodes from this library section.
     *
     * @param maxresults Max number of items to return (default 50).
     */
    async recentlyAdded(args: any, libtype = "episode", maxresults = 50) {
        return this.search({ libtype, maxresults, sort: "episode.addedAt:desc", ...args });
    }
}

/** Represents a single Hub (or category) in the PlexServer search */
export class Hub extends PlexObject {
    static override TAG = "Hub";

    hubIdentifier!: string;
    /** Number of items found. */
    size!: number;
    title!: string;
    type!: string;
    Directory: SearchResult["Directory"];
    Metadata: SearchResult["Metadata"];

    protected _loadData(data: SearchResult) {
        this.hubIdentifier = data.hubIdentifier;
        this.size = data.size;
        this.title = data.title;
        this.type = data.type;
        this.Directory = data.Directory;
        this.Metadata = data.Metadata;
    }
}

/**
 * Represents a Folder inside a library.
 */
export class Folder extends PlexObject {
    title!: string;

    /**
     * Returns a list of available Folders for this folder.
     * Continue down subfolders until a mediaType is found.
     */
    async subfolders() {
        if (this.key.startsWith("/library/metadata")) {
            return fetchItems<Folder>(this.server, this.key);
        }

        return fetchItems<Folder>(this.server, this.key, undefined, Folder);
    }

    protected _loadData(data: any) {
        this.key = data.key;
        this.title = data.title;
    }
}

export class Collections<CollectionVideoType = VideoType> extends PartialPlexObject {
    static override TAG = "Directory";
    TYPE = "collection";

    guid!: string;
    librarySectionTitle!: string;
    librarySectionKey!: string;
    contentRating!: string;
    subtype!: string;
    summary!: string;
    index!: number;
    thumb!: string;
    addedAt!: number;
    updatedAt!: number;
    childCount!: number;
    maxYear!: string;
    minYear!: string;
    art?: string;

    // TODO: can this be set in the constructor?
    VIDEO_TYPE!: Class<CollectionVideoType>;

    // Alias for childCount
    get size() {
        return this.childCount;
    }

    /**
     * Returns a list of all items in the collection.
     */
    async items() {
        const key = `/library/metadata/${this.ratingKey}/children`;
        const data = await this.server.query<MediaContainer<{ Metadata?: any[] }>>(key);
        return data.MediaContainer.Metadata?.map((d) => new this.VIDEO_TYPE(this.server, d, undefined, this)) ?? [];
    }

    protected _loadFullData(data: any) {
        this._loadData(data);
    }

    protected _loadData(data: CollectionData) {
        this.key = data.key;
        this.title = data.title;
        this.ratingKey = data.ratingKey;
        this.guid = data.guid;
        this.type = data.type;
        this.librarySectionTitle = data.librarySectionTitle;
        this.librarySectionID = data.librarySectionID;
        this.librarySectionKey = data.librarySectionKey;
        this.contentRating = data.contentRating;
        this.subtype = data.subtype;
        this.summary = data.summary;
        this.index = data.index;
        this.thumb = data.thumb;
        this.addedAt = data.addedAt;
        this.updatedAt = data.updatedAt;
        this.childCount = Number(data.childCount ?? data.size ?? "0");
        this.maxYear = data.maxYear;
        this.minYear = data.minYear;
        this.art = data.art;
    }
}

export class FilterChoice extends PlexObject {
    static override TAG = "Directory";

    /**
     * API URL path to quickly list all items with this filter choice.
     * (/library/sections/<section>/all?genre=<key>)
     */
    fastKey!: string;
    /** Thumbnail URL for the filter choice. */
    thumb?: string;
    /** The title of the filter choice. */
    title!: string;
    /** The filter type (genre, contentRating, etc). */
    type!: string;

    protected _loadData(data: CollectionData) {
        this.key = data.key;
        this.title = data.title;
        this.type = data.type;
        this.thumb = data.thumb;
    }
}

export class FilteringType extends PlexObject {
    static override TAG = "Type";

    /** The libtype for the filter. */
    type!: string;
    /** True if this filter type is currently active. */
    active!: boolean;
    fields!: FilteringField[];
    filters!: FilteringFilter[];

    /** List of sort objects. */
    sorts: any;
    /** The title for the libtype filter. */
    title!: string;

    _loadData(data: any) {
        this.active = data.active;
        this.fields = findItems(data, undefined, FilteringField);
        this.filters = findItems(data, undefined, FilteringFilter);
        this.key = data.key;
        this.sorts = findItems(data, undefined, FilteringSort);
        this.title = data.title;
        this.type = data.type;
    }
}

/**
 * Represents a single Filter object for a {@link FilteringType}
 */
export class FilteringFilter extends PlexObject {
    static override TAG = "Filter";

    /** The key for the filter. */
    filter!: string;
    /** The :class:`~plexapi.library.FilteringFieldType` type (string, boolean, integer, date, etc). */
    filterType!: string;
    /** The title of the filter. */
    title!: string;
    /** 'filter' */
    type!: string;

    _loadData(data: any) {
        this.filter = data.filter;
        this.filterType = data.filterType;
        this.key = data.key;
        this.title = data.title;
        this.type = data.type;
    }
}

/**
 * Represents a single Sort object for a {@link FilteringType}
 */
export class FilteringSort extends PlexObject {
    static override TAG = "Sort";

    /** True if the sort is currently active. */
    active!: boolean;
    /** The currently active sorting direction. */
    activeDirection!: string;
    /** The currently active default sorting direction. */
    default!: string;
    /** The default sorting direction. */
    defaultDirection!: string;
    /** The URL key for sorting with desc. */
    descKey!: string;
    /** API URL path for first character endpoint. */
    firstCharacterKey!: string;
    /** The title of the sorting. */
    title!: string;

    _loadData(data: any) {
        this.active = data.active;
        this.activeDirection = data.activeDirection;
        this.default = data.default;
        this.defaultDirection = data.defaultDirection;
        this.descKey = data.descKey;
        this.firstCharacterKey = data.firstCharacterKey;
        this.key = data.key;
        this.title = data.title;
    }
}

/**
 * Represents a single Field object for a {@link FilteringType}
 */
export class FilteringField extends PlexObject {
    static override TAG = "Field";

    type!: string;
    title!: string;
    /** The subtype of the filter (decade, rating, etc) */
    subType!: string;

    _loadData(data: any) {
        this.key = data.key;
        this.title = data.title;
        this.type = data.type;
        this.subType = data.subType;
    }
}

/**
 * Represents a single FieldType for library filtering.
 */
export class FilteringFieldType extends PlexObject {
    static override TAG = "FieldType";

    /** The filtering data type (string, boolean, integer, date, etc). */
    type!: string;
    operators!: FilteringOperator[];

    _loadData(data: any) {
        this.type = data.type;
        this.operators = findItems(data, undefined, FilteringOperator);
    }
}

/**
 * Represents a single FilterChoice for library filtering.
 */
export class FilteringOperator extends PlexObject {
    static override TAG = "Operator";

    /** The libtype for the filter. */
    type!: string;

    _loadData(data: any) {
        this.key = data.key;
        this.type = data.type;
    }
}
