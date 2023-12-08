import { URL, URLSearchParams } from "url";

import axios from "axios";

import { Player } from "./client.types";
import { BASE_HEADERS, TIMEOUT } from "./config";
import { MediaContainer } from "./util";

export interface PlexOptions {
    /** (:class:`~plexapi.server.PlexServer`): PlexServer this client is connected to (optional). */
    server?: any;
    /** (ElementTree): Response from PlexServer used to build this object (optional). */
    data?: any;
    /** (str): Path used to generate data. */
    initpath?: string;
    /** (str): HTTP URL to connect dirrectly to this client. */
    baseurl?: string;
    /** (str): X-Plex-Token used for authenication (optional). */
    token?: string;
    /** (:class:`~requests.Session`): requests.Session object if you want more control (optional). */
    session?: string;
    /** (int): timeout in seconds on initial connect to client (default config.TIMEOUT). */
    timeout?: number;
}

/**
 * Main class for interacting with a Plex client. This class can connect
 * directly to the client and control it or proxy commands through your
 * Plex Server. To better understand the Plex client API's read this page:
 * https://github.com/plexinc/plex-media-player/wiki/Remote-control-API
 * Attributes:
 *     TAG (str): 'Player'
 *     key (str): '/resources'
 *     device (str): Best guess on the type of device this is (PS, iPhone, Linux, etc).
 *     deviceClass (str): Device class (pc, phone, etc).
 *     machineIdentifier (str): Unique ID for this device.
 *     model (str): Unknown
 *     platform (str): Unknown
 *     platformVersion (str): Description
 *     product (str): Client Product (Plex for iOS, etc).
 *     protocol (str): Always seems ot be 'plex'.
 *     protocolCapabilities (list<str>): List of client capabilities (navigation, playback,
 *         timeline, mirror, playqueues).
 *     protocolVersion (str): Protocol version (1, future proofing?)
 *     server (:class:`~plexapi.server.PlexServer`): Server this client is connected to.
 *     session (:class:`~requests.Session`): Session object used for connection.
 *     state (str): Unknown
 *     title (str): Name of this client (Johns iPhone, etc).
 *     token (str): X-Plex-Token used for authenication
 *     vendor (str): Unknown
 *     version (str): Device version (4.6.1, etc).
 *     _session (obj): Requests session object used to access this client.
 *     _proxyThroughServer (bool): Set to True after calling
 *         :func:`~plexapi.client.PlexClient.proxyThroughServer()` (default False).
 */
export class PlexClient {
    /**
     * HTTP address of the client
     */
    _baseurl: string | null = null;
    /**
     * Token used to access this client
     */
    _token: string | null = null;
    TAG = "Player";
    key = "/resources";

    deviceClass?: string;
    machineIdentifier?: string;
    product?: string;
    protocol?: string;
    protocolCapabilities?: string[];
    protocolVersion?: string;
    platform?: string;
    platformVersion?: string;
    title?: string;

    constructor(options: PlexOptions = {}) {
        if (options.baseurl) {
            if (options.baseurl.endsWith("/")) {
                this._baseurl = options.baseurl.slice(0, -1);
            } else {
                this._baseurl = options.baseurl;
            }
        }

        this._baseurl = options.baseurl ?? "http://localhost:32400";
        this._token = options.token ?? null;
    }

    /**
     * Alias of reload as any subsequent requests to this client will be
     * made directly to the device even if the object attributes were initially
     * populated from a PlexServer.
     * @param timeout
     */
    async connect(timeout?: number): Promise<void> {
        const data = await this.query<MediaContainer<{ Player: Player }>>(this.key, undefined, undefined, timeout);
        this._loadData(data.MediaContainer.Player);
    }

    /**
     * @alias PlexClient.connect
     */
    async reload() {
        return this.connect();
    }

    /**
     * Main method used to handle HTTPS requests to the Plex client. This method helps
     * by encoding the response to utf-8 and parsing the returned XML into and
     * ElementTree object. Returns None if no data exists in the response.
     * TODO: use headers
     * @param path
     * @param method
     * @param headers
     * @param timeout
     */
    async query<T>(path: string, method: "get" | "post" | "put" | "patch" | "head" | "delete" = "get", headers?: Record<string, string>, timeout?: number): Promise<T> {
        const headersObj = this.headers(headers);
        const response = await axios({
            method: method,
            url: this.url(path).toString(),
            timeout: timeout ?? TIMEOUT,
            headers: headersObj,
        }).then((response) => response.data);

        return response;
    }

    /**
     * Build a URL string with proper token argument. Token will be appended to the URL
     * if either includeToken is True or TODO: CONFIG.log.show_secrets is 'true'.
     * @param key
     * @param includeToken
     */
    url(key: string, includeToken = false): URL {
        if (!this._baseurl) {
            throw new Error("PlexClient object missing baseurl.");
        }

        const url = new URL(key, this._baseurl);
        if (this._token && includeToken) {
            const searchParams = new URLSearchParams();
            searchParams.append("X-Plex-Token", this._token);
            url.search = searchParams.toString();
            return url;
        }

        return url;
    }

    protected _loadData(data: Player) {
        this.deviceClass = data.deviceClass;
        this.machineIdentifier = data.machineIdentifier;
        this.product = data.product;
        this.protocol = data.protocol;
        this.protocolCapabilities = data.protocolCapabilities.split(",");
        this.protocolVersion = data.protocolVersion;
        this.platform = data.platform;
        this.platformVersion = data.platformVersion;
        this.title = data.title;
    }

    /**
     * Returns a dict of all default headers for Client requests.
     */
    private headers(headers: Record<string, string> = {}) {
        const headersObj: Record<string, string> = {
            ...BASE_HEADERS,
            ...headers,
        };
        if (this._token) {
            headersObj["X-Plex-Token"] = this._token;
        }

        return headersObj;
    }
}
