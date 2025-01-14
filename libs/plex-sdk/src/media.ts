import { PlexObject } from "./base/plexObject";
import { ChapterData, MarkerData, MediaData, MediaPartData, MediaPartStreamData } from "./video.types";

/**
 * Base class for media tags used for filtering and searching your library
 * items or navigating the metadata of media items in your library. Tags are
 * the construct used for things such as Country, Director, Genre, etc.
 */
abstract class MediaTag extends PlexObject {
    static override TAG: string;
    /** Tag ID (This seems meaningless except to use it as a unique id). */
    id?: string;
    /** unknown */
    role?: string;
    /**
     * Name of the tag. This will be Animation, SciFi etc for Genres.
     * The name of person for Directors and Roles (ex: Animation, Stephen Graham, etc).
     */
    tag!: string;
    abstract FILTER: string;

    // async items(): Promise<any[]> {
    //   if (!this.key) {
    //     throw new Error(`Key is not defined for this tag: ${this.tag}`);
    //   }

    //   return fetchItems(this.server, this.key);
    // }

    protected _loadData(data: any): void {
        this.key = data.key;
        this.id = data.id;
        this.role = data.role;
        this.tag = data.tag;
    }
}

export class Media extends PlexObject {
    static override TAG = "Media" as const;
    aspectRatio!: number;
    /**
     * Number of audio channels for this video (ex: 6)
     */
    audioChannels!: number;
    /**
     * Audio codec used within the video (ex: ac3)
     */
    audioCodec!: string;
    /**
     * Bitrate of the video (ex: 1624)
     */
    bitrate!: number;
    /**
     * Length of the video in milliseconds (ex: 6990483)
     */
    duration!: number;
    /**
     * Height of the video in pixels (ex: 256)
     */
    height!: number;
    /**
     * Plex ID of this media item
     */
    id!: number;
    /**
     * True if video has 64 bit offsets
     */
    has64bitOffsets!: boolean;
    optimizedForStreaming!: boolean;
    title?: string;
    videoCodec!: string;
    videoFrameRate!: string;
    videoProfile!: string;
    /** Width of the video in pixels */
    width!: number;
    parts!: MediaPart[];

    protected _loadData(data: MediaData) {
        this.aspectRatio = data.aspectRatio;
        this.audioChannels = data.audioChannels;
        this.audioCodec = data.audioCodec;
        this.bitrate = data.bitrate;
        this.duration = data.duration;
        this.height = data.height;
        this.id = data.id;
        this.has64bitOffsets = data.has64bitOffsets;
        this.optimizedForStreaming = data.optimizedForStreaming;
        this.title = data.title;
        this.videoCodec = data.videoCodec;
        this.videoFrameRate = data.videoFrameRate;
        this.videoProfile = data.videoProfile;
        this.width = data.width;
        this.parts = data.Part.map((part) => new MediaPart(this.server, part, undefined, this));
    }
}

export class MediaPart extends PlexObject {
    static override TAG = "Part" as const;

    container!: string;
    duration!: number;
    file!: string;
    id!: number;
    indexes!: string;
    size!: number;
    optimizedForStreaming!: boolean;
    syncItemId!: string;
    syncState!: string;
    videoProfile!: string;
    streams!: MediaPartStream[];
    exists?: boolean;

    protected _loadData(data: MediaPartData) {
        this.container = data.container;
        this.duration = data.duration;
        this.file = data.file;
        this.id = data.id;
        this.key = data.key;
        this.size = data.size;
        this.optimizedForStreaming = data.optimizedForStreaming;
        this.videoProfile = data.videoProfile;
        this.exists = data.exists;
        this.streams = data.Stream?.map((stream) => new MediaPartStream(this.server, stream, undefined, this)) ?? [];
    }
}

export class MediaPartStream extends PlexObject {
    static override TAG = "Stream" as const;

    id!: number;
    codec!: string;
    index!: number;
    language?: string;
    languageCode?: string;
    selected?: boolean;
    streamType?: number;

    protected _loadData(data: MediaPartStreamData) {
        this.id = data.id;
        this.codec = data.codec;
        this.index = data.index;
        this.language = data.language;
        this.languageCode = data.languageCode;
        this.selected = data.selected;
        this.streamType = data.streamType;
    }
}

/**
 * Represents a single Role (actor/actress) media tag.
 */
export class Role extends MediaTag {
    static override TAG = "Role" as const;
    FILTER = "role" as const;
}

/**
 * Represents a single Genre media tag.
 */
export class Genre extends MediaTag {
    static override TAG = "Genre" as const;
    FILTER = "genre" as const;
}

/**
 * Represents a single Country media tag.
 */
export class Country extends MediaTag {
    static override TAG = "Country" as const;
    FILTER = "country" as const;
}

/**
 * Represents a single Writer media tag.
 */
export class Writer extends MediaTag {
    static override TAG = "Writer" as const;
    FILTER = "writer" as const;
}

/**
 * Represents a single Director media tag.
 */
export class Director extends MediaTag {
    static override TAG = "Director" as const;
    FILTER = "director" as const;
}

export class Similar extends MediaTag {
    static override TAG = "Similar" as const;
    FILTER = "similar" as const;
}

export class Producer extends MediaTag {
    static override TAG = "Producer" as const;
    FILTER = "producer" as const;
}

export class Marker extends MediaTag {
    static override TAG = "Marker" as const;
    FILTER = "marker" as const;

    type!: "intro";
    startTimeOffset!: number;
    endTimeOffset!: number;

    protected override _loadData(data: MarkerData) {
        this.type = data.type;
        this.startTimeOffset = data.startTimeOffset;
        this.endTimeOffset = data.endTimeOffset;
    }
}

/**
 * Represents a single Chapter media tag.
 */
export class Chapter extends MediaTag {
    static override TAG = "Chapter" as const;
    FILTER = "chapter" as const;

    startTimeOffset!: number;
    endTimeOffset!: number;
    thumb?: string;

    protected override _loadData(data: ChapterData) {
        this.startTimeOffset = data.startTimeOffset;
        this.endTimeOffset = data.endTimeOffset;
        this.thumb = data.thumb;
    }
}

/**
 * Represents a single Collection media tag.
 */
export class Collection extends MediaTag {
    static override TAG = "Collection" as const;
    FILTER = "collection" as const;
}

export class Optimized extends PlexObject {
    static override TAG = "Item";
    id!: string;
    composite!: any;
    title!: any;
    type!: any;
    target!: any;
    targetTagID!: any;

    protected _loadData(data: any) {
        this.id = data.id;
        this.composite = data.composite;
        this.title = data.title;
        this.type = data.type;
        this.target = data.target;
        this.targetTagID = data.targetTagID;
    }
}

/**
 * Base class for guid tags used only for Guids, as they contain only a string identifier
 */
class GuidTag extends PlexObject {
    /**
     * The guid for external metadata sources (e.g. IMDB, TMDB, TVDB). ex - imdb://tt3222784
     */
    id!: string;

    protected _loadData(data: any) {
        this.id = data.id;
    }
}

export class Guid extends GuidTag {
    static override TAG = "Guid" as const;
}
