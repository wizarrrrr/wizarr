import { URL, URLSearchParams } from "url";

import { fetchItem, fetchItems } from "./baseFunctionality";
import { PlexClient } from "./client";
import { BASE_HEADERS, TIMEOUT, X_PLEX_CONTAINER_SIZE } from "./config";
import { Hub, Library } from "./library";
import { LibraryRootResponse } from "./library.types";
import { Optimized } from "./media";
import { MyPlexAccount } from "./myplex";
import { Agent, SEARCHTYPES } from "./search";
import { ConnectionInfo, HistoryMediaContainer, HistoryMetadatum, ServerRootResponse } from "./server.types";
import { SettingResponse, Settings } from "./settings";
import { MediaContainer } from "./util";
import axios from "axios";

/**
 * This is the main entry point to interacting with a Plex server. It allows you to
 * list connected clients, browse your library sections and perform actions such as
 * emptying trash. If you do not know the auth token required to access your Plex
 * server, or simply want to access your server with your username and password, you
 * can also create an PlexServer instance from :class:`~plexapi.myplex.MyPlexAccount`.
 */
export class PlexServer {
    key = "/";
    /** True if server allows camera upload */
    allowCameraUpload!: boolean;
    /** True if server allows channel access (iTunes?) */
    allowChannelAccess!: boolean;
    /** True is server allows media to be deleted. */
    allowMediaDeletion!: boolean;
    /** True is server allows sharing */
    allowSharing!: boolean;
    /** True is server allows sync */
    allowSync!: boolean;
    /** Unknown */
    allowTuners!: boolean;
    /** Unknown */
    livetv!: number;
    /** Unknown */
    backgroundProcessing!: boolean;
    /** True if server has an HTTPS certificate */
    certificate!: boolean;
    /** Unknown */
    companionProxy!: boolean;
    /** Unknown */
    diagnostics!: string;
    /** Unknown */
    eventStream!: boolean;
    /** Human friendly name for this server */
    friendlyName!: string;
    /**
     * True if `Hub Search <https!://www.plex.tv/blog
     * /seek-plex-shall-find-leveling-web-app/>`_ is enabled. I believe this
     * is enabled for everyone
     */
    hubSearch!: boolean;
    /** Unique ID for this server (looks like an md5) */
    machineIdentifier?: string;
    /**
     * True if `multiusers <https!://support.plex.tv/hc/en-us/articles/200250367-Multi-User-Support>`_ are enabled.
     */
    multiuser!: boolean;
    /** Unknown (True if logged into myPlex?) */
    myPlex!: boolean;
    /** Unknown (ex!: mapped) */
    myPlexMappingState!: string;
    /** Unknown (ex!: ok). */
    myPlexSigninState!: string;
    /** True if you have a myPlex subscription */
    myPlexSubscription!: boolean;
    /** Email address if signed into myPlex (user@example.com) */
    myPlexUsername!: string;
    /**
     * List of features allowed by the server owner. This may be based
     * on your PlexPass subscription. Features include!: camera_upload, cloudsync,
     * content_filter, dvr, hardware_transcoding, home, lyrics, music_videos, pass,
     * photo_autotags, premium_music_metadata, session_bandwidth_restrictions, sync,
     * trailers, webhooks (and maybe more).
     */
    ownerFeatures!: string[];
    /**
     * True if photo `auto-tagging <https!://support.plex.tv/hc/en-us/articles/234976627-Auto-Tagging-of-Photos>`_ is enabled.
     */
    photoAutoTag!: boolean;
    /** Platform the server is hosted on (ex!: Linux) */
    platform!: string;
    /** Platform version (ex!: '6.1 (Build 7601)', '4.4.0-59-generic'). */
    platformVersion!: string;
    /** Unknown */
    pluginHost!: boolean;
    /** Unknown */
    readOnlyLibraries!: boolean;
    /** Unknown */
    requestParametersInCookie!: boolean;
    /**
     * Current `Streaming Brain <https!://www.plex.tv/blog/mcstreamy-brain-take-world-two-easy-steps/>`_ version.
     */
    streamingBrainVersion!: number;
    streamingBrainABRVersion!: number;
    /**
     * True if `syncing to a device <https!://support.plex.tv/hc/en-us/articles/201053678-Sync-Media-to-a-Device>`_ is enabled.
     */
    sync!: boolean;
    /**
     * Number of active video transcoding sessions.
     */
    transcoderActiveVideoSessions!: number;
    /** True if audio transcoding audio is available. */
    transcoderAudio!: boolean;
    /** True if audio transcoding lyrics is available. */
    transcoderLyrics!: boolean;
    /** True if audio transcoding photos is available. */
    transcoderPhoto!: boolean;
    /** True if audio transcoding subtitles is available. */
    transcoderSubtitles!: boolean;
    /** True if audio transcoding video is available. */
    transcoderVideo!: boolean;
    /** List of video bitrates. */
    transcoderVideoBitrates!: string;
    /** List of video qualities. */
    transcoderVideoQualities!: string;
    /** List of video resolutions. */
    transcoderVideoResolutions!: string;
    /** Datetime the server was updated. */
    updatedAt!: number;
    /** Unknown */
    updater!: boolean;
    /** Current Plex version (ex!: 1.3.2.3112-1751929) */
    version!: string;
    /** True if voice search is enabled. (is this Google Voice search?) */
    voiceSearch!: boolean;
    /** Unknown */
    pushNotifications!: boolean;
    _library?: Library;
    _settings?: Settings;
    private _myPlexAccount?: MyPlexAccount;

    constructor(
        public readonly baseurl: string,
        public readonly token: string,
        public readonly timeout?: number,
    ) {}

    async agents(mediaType?: number | string) {
        let key = "/system/agents";
        if (mediaType) {
            key += `?mediaType=${mediaType}`;
        }

        return fetchItems<Agent>(this, key, undefined, Agent, this);
    }

    async connect(): Promise<void> {
        const data = await this.query<MediaContainer<ServerRootResponse>>(this.key, undefined, undefined, this.timeout);
        this._loadData(data.MediaContainer);

        // Attempt to prevent token from being logged accidentally
        if (this.token) {
            Object.defineProperty(this, "token", {
                enumerable: false,
                value: this.token,
            });
        }
    }

    /**
     * Library to browse or search your media.
     */
    async library(): Promise<Library> {
        if (this._library) {
            return this._library;
        }

        try {
            const data = await this.query<MediaContainer<LibraryRootResponse>>(Library.key);
            this._library = new Library(this, data.MediaContainer);
        } catch {
            // TODO: validate error type, also TODO figure out how this is used
            const data = await this.query<MediaContainer<LibraryRootResponse>>("/library/sections/");
            this._library = new Library(this, data.MediaContainer);
        }

        return this._library;
    }

    /**
     * Returns a list of media items or filter categories from the resulting
     * `Hub Search <https://www.plex.tv/blog/seek-plex-shall-find-leveling-web-app/>`_
     * against all items in your Plex library. This searches genres, actors, directors,
     * playlists, as well as all the obvious media titles. It performs spell-checking
     * against your search terms (because KUROSAWA is hard to spell). It also provides
     * contextual search results. So for example, if you search for 'Pernice', it’ll
     * return 'Pernice Brothers' as the artist result, but we’ll also go ahead and
     * return your most-listened to albums and tracks from the artist. If you type
     * 'Arnold' you’ll get a result for the actor, but also the most recently added
     * movies he’s in.
     * @param query Query to use when searching your library.
     * @param mediatype Optionally limit your search to the specified media type.
     * @param limit Optionally limit to the specified number of results per Hub.
     */
    async search(query: string, mediatype?: keyof typeof SEARCHTYPES, limit?: number): Promise<Hub[]> {
        const params: Record<string, string> = { query };

        if (mediatype) {
            params["section"] = SEARCHTYPES[mediatype].toString();
        }

        if (limit) {
            params["limit"] = limit.toString();
        }

        const key = "/hubs/search?" + new URLSearchParams(params).toString();
        const hubs = await fetchItems<Hub>(this, key, undefined, Hub, this);
        return hubs;
    }

    /**
     * Main method used to handle HTTPS requests to the Plex server. This method helps
     * by encoding the response to utf-8 and parsing the returned XML into and
     * ElementTree object. Returns None if no data exists in the response.
     * TODO: use headers
     * @param path
     * @param method
     * @param headers
     * @param timeout
     */
    async query<T = any>(path: string, method: "get" | "post" | "put" | "patch" | "head" | "delete" = "get", headers?: any, timeout?: number, username?: string, password?: string): Promise<T> {
        const requestHeaders = this._headers();
        if (username && password) {
            const credentials = Buffer.from(`${username}:${password}`).toString("base64");
            requestHeaders["Authorization"] = `Basic ${credentials}`;
        }

        const url = this.url(path);
        const response = await axios<T>({
            method,
            url: url.toString(),
            headers: requestHeaders,
            timeout: timeout ?? TIMEOUT,
            auth: username && password ? { username, password } : undefined,
        }).then((res) => res.data);

        return response;
    }

    /**
     * Returns a list of media items from watched history. If there are many results, they will
     * be fetched from the server in batches of X_PLEX_CONTAINER_SIZE amounts. If you're only
     * looking for the first <num> results, it would be wise to set the maxresults option to that
     * amount so this functions doesn't iterate over all results on the server.
     * @param maxresults Only return the specified number of results (optional).
     * @param mindate Min datetime to return results from. This really helps speed up the result listing. For example: datetime.now() - timedelta(days=7)
     * @param ratingKey request history for a specific ratingKey item.
     * @param accountId request history for a specific account ID.
     * @param librarySectionId request history for a specific library section ID.
     */
    async history(maxresults = 9999999, mindate?: Date, ratingKey?: number | string, accountId?: number | string, librarySectionId?: number | string): Promise<HistoryMetadatum[]> {
        const args: Record<string, string> = { sort: "viewedAt:desc" };
        if (ratingKey !== undefined) {
            args["metadataItemID"] = ratingKey.toString();
        }

        if (accountId !== undefined) {
            args["accountID"] = accountId.toString();
        }

        if (librarySectionId !== undefined) {
            args["librarySectionID"] = librarySectionId.toString();
        }

        if (mindate !== undefined) {
            args["viewedAt>"] = mindate.getTime().toString();
        }

        args["X-Plex-Container-Start"] = "0";
        args["X-Plex-Container-Size"] = Math.min(X_PLEX_CONTAINER_SIZE, maxresults).toString();

        let results: HistoryMetadatum[] = [];
        let key = "/status/sessions/history/all?" + new URLSearchParams(args).toString();
        let raw = await this.query<MediaContainer<HistoryMediaContainer>>(key);
        const totalResults = raw.MediaContainer.totalSize;
        results = results.concat(raw.MediaContainer.Metadata);
        while (results.length <= totalResults && X_PLEX_CONTAINER_SIZE === raw.MediaContainer.size && maxresults > results.length) {
            args["X-Plex-Container-Start"] = (Number(args["X-Plex-Container-Start"]) + Number(args["X-Plex-Container-Size"])).toString();
            key = "/status/sessions/history/all?" + new URLSearchParams(args).toString();
            // eslint-disable-next-line no-await-in-loop
            raw = await this.query<MediaContainer<HistoryMediaContainer>>(key);
            results = results.concat(raw.MediaContainer.Metadata);
        }

        return results;
    }

    async settings(): Promise<Settings> {
        if (!this._settings) {
            const data = await this.query<MediaContainer<{ Setting: SettingResponse[] }>>(Settings.key);
            this._settings = new Settings(this, data.MediaContainer.Setting);
        }

        return this._settings;
    }

    // TODO: not sure if this works
    // /**
    //  * Returns a list of all playlist objects saved on the server.
    //  */
    // async playlists(): Promise<any> {
    //   // TODO: Add sort and type options? (this comment is in py-plex)
    //   // /playlists/all?type=15&sort=titleSort%3Aasc&playlistType=video&smart=0
    //   const data = this.query('/playlists');
    //   console.log(JSON.stringify(data));
    // }

    /**
     * Returns a :class:`~plexapi.myplex.MyPlexAccount` object using the same
     * token to access this server. If you are not the owner of this PlexServer
     * you're likley to recieve an authentication error calling this.
     */
    myPlexAccount(): MyPlexAccount {
        if (!this._myPlexAccount) {
            this._myPlexAccount = new MyPlexAccount(this.baseurl, undefined, undefined, this.token, this.timeout, this);
        }

        return this._myPlexAccount;
    }

    // Returns list of all :class:`~plexapi.client.PlexClient` objects connected to server.
    async clients(): Promise<PlexClient[]> {
        const items: PlexClient[] = [];
        const response = await this.query<MediaContainer<ConnectionInfo | undefined>>("/clients");

        if (response.MediaContainer?.Server === undefined) {
            return [];
        }

        const shouldFetchPorts = response.MediaContainer.Server.some((server) => server.port === null || server.port === undefined);
        let ports: Record<string, string> = {};

        if (shouldFetchPorts) {
            ports = await this._myPlexClientPorts();
        }

        for (const server of response.MediaContainer.Server) {
            let { port } = server;
            if (!port) {
                // TODO: print warning about doing weird port stuff
                port = Number(ports?.[server.machineIdentifier]);
            }

            const baseurl = `http://${server.host}:${port}`;
            items.push(new PlexClient({ baseurl, token: this.token, server: this, data: server }));
        }

        return items;
    }

    /** Returns list of all :class:`~plexapi.media.Optimized` objects connected to server. */
    async optimizedItems(): Promise<Optimized[]> {
        const backgroundProcessing = await fetchItem(this, "/playlists?type=42");
        const items = await fetchItems<Optimized>(this, backgroundProcessing.key, undefined, Optimized, this);
        return items;
    }

    /**
     * Build a URL string with proper token argument. Token will be appended to the URL
     * if either includeToken is True or TODO: CONFIG.log.show_secrets is 'true'.
     */
    url(key: string, includeToken = false, params?: URLSearchParams): URL {
        if (!this.baseurl) {
            throw new Error("PlexClient object missing baseurl.");
        }

        const url = new URL(key, this.baseurl);
        if (this.token && includeToken) {
            const searchParams = new URLSearchParams(params);
            searchParams.append("X-Plex-Token", this.token);
            url.search = searchParams.toString();
            return url;
        }

        return url;
    }

    /**
     * Build the Plex Web URL for the object.
     * @param base The base URL before the fragment (``#!``).
     *    Default is https://app.plex.tv/desktop.
     * @param endpoint The Plex Web URL endpoint.
     *    None for server, 'playlist' for playlists, 'details' for all other media types.
     */
    _buildWebURL(base = "https://app.plex.tv/desktop/", endpoint?: string, params?: URLSearchParams): string {
        if (endpoint) {
            return `${base}#!/server/${this.machineIdentifier}/${endpoint}?${params?.toString()}`;
        }

        return `${base}#!/media/${this.machineIdentifier}/com.plexapp.plugins.library?${params?.toString()}`;
    }

    _uriRoot(): string {
        return `server://${this.machineIdentifier}/com.plexapp.plugins.library`;
    }

    private _headers(): Record<string, string> {
        const headers: Record<string, string> = {
            ...BASE_HEADERS,
            "Content-type": "application/json",
        };
        if (this.token) {
            headers["X-Plex-Token"] = this.token;
        }

        return headers;
    }

    private _loadData(data: ServerRootResponse): void {
        this.allowCameraUpload = data.allowCameraUpload;
        this.allowChannelAccess = data.allowChannelAccess;
        this.allowMediaDeletion = data.allowMediaDeletion;
        this.allowSharing = data.allowSharing;
        this.allowSync = data.allowSync;
        this.allowTuners = data.allowTuners;
        this.livetv = data.livetv;
        this.backgroundProcessing = data.backgroundProcessing;
        this.certificate = data.certificate;
        this.companionProxy = data.companionProxy;
        this.diagnostics = data.diagnostics;
        this.eventStream = data.eventStream;
        this.friendlyName = data.friendlyName;
        this.hubSearch = data.hubSearch;
        this.machineIdentifier = data.machineIdentifier;
        this.multiuser = data.multiuser;
        this.myPlex = data.myPlex;
        this.myPlexMappingState = data.myPlexMappingState;
        this.myPlexSigninState = data.myPlexSigninState;
        this.myPlexSubscription = data.myPlexSubscription;
        this.myPlexUsername = data.myPlexUsername;
        this.ownerFeatures = data.ownerFeatures.split(",");
        this.photoAutoTag = data.photoAutoTag;
        this.platform = data.platform;
        this.platformVersion = data.platformVersion;
        this.pluginHost = data.pluginHost;
        this.pushNotifications = data.pushNotifications;
        this.readOnlyLibraries = data.readOnlyLibraries;
        this.requestParametersInCookie = data.requestParametersInCookie;
        this.streamingBrainABRVersion = data.streamingBrainABRVersion;
        this.streamingBrainVersion = data.streamingBrainVersion;
        this.sync = data.sync;
        this.transcoderActiveVideoSessions = data.transcoderActiveVideoSessions;
        this.transcoderAudio = data.transcoderAudio;
        this.transcoderLyrics = data.transcoderLyrics;
        this.transcoderPhoto = data.transcoderPhoto;
        this.transcoderSubtitles = data.transcoderSubtitles;
        this.transcoderVideo = data.transcoderVideo;
        this.transcoderVideoBitrates = data.transcoderVideoBitrates;
        this.transcoderVideoQualities = data.transcoderVideoQualities;
        this.transcoderVideoResolutions = data.transcoderVideoResolutions;
        this.updatedAt = data.updatedAt;
        this.updater = data.updater;
        this.version = data.version;
        this.voiceSearch = data.voiceSearch;
    }

    /**
     * Sometimes the PlexServer does not properly advertise port numbers required
     * to connect. This attemps to look up device port number from plex.tv.
     * See python plex issue #126: Make PlexServer.clients() more user friendly.
     */
    private async _myPlexClientPorts(): Promise<Record<string, string>> {
        const ports: Record<string, string> = {};
        const account = this.myPlexAccount();
        const devices = await account.devices();

        for (const device of devices) {
            if (device.connections?.length) {
                ports[device.clientIdentifier] = new URL("http://172.17.0.2:32400").port;
            }
        }

        return ports;
    }
}
