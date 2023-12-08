export interface MatchSearchResult {
  thumb: string;
  guid: string;
  name: string;
  score: number;
  year: number;
  lifespanEnded: boolean;
}

export interface SearchResult {
  title: string;
  type: string;
  hubIdentifier: string;
  context: string;
  size: number;
  more: boolean;
  style: string;
  Directory?: Directory[];
  Metadata?: Metadatum[];
}

export interface Directory {
  key: string;
  librarySectionID: number;
  librarySectionKey: string;
  librarySectionTitle: string;
  librarySectionType: number;
  reason: string;
  reasonID: number;
  reasonTitle: string;
  type: string;
  id: number;
  filter: string;
  tag: string;
  tagType: number;
  count: number;
  thumb?: string;
}

interface Metadatum {
  librarySectionTitle: string;
  ratingKey: string;
  key: string;
  guid: string;
  studio?: string;
  type: string;
  title: string;
  contentRating: string;
  rating: number;
  viewCount?: number;
  lastViewedAt?: number;
  year: number;
  tagline?: string;
  thumb: string;
  art: string;
  duration: number;
  originallyAvailableAt: string;
  addedAt: number;
  updatedAt: number;
  chapterSource?: string;
  primaryExtraKey?: string;
  ratingImage?: string;
  Media?: Media[];
  Genre?: CollectionTagData[];
  Director?: CollectionTagData[];
  Writer?: CollectionTagData[];
  Country?: CollectionTagData[];
  Collection?: CollectionTagData[];
  Role?: CollectionTagData[];
  parentRatingKey?: string;
  grandparentRatingKey?: string;
  parentGuid?: string;
  grandparentGuid?: string;
  titleSort?: string;
  grandparentKey?: string;
  parentKey?: string;
  grandparentTitle?: string;
  parentTitle?: string;
  index?: number;
  parentIndex?: number;
  parentThumb?: string;
  grandparentThumb?: string;
  grandparentArt?: string;
  grandparentTheme?: string;
  librarySectionID?: number;
  librarySectionKey?: string;
  reason?: string;
  reasonID?: number;
  reasonTitle?: string;
  banner?: string;
  theme?: string;
  leafCount?: number;
  viewedLeafCount?: number;
  childCount?: number;
  Field?: Field[];
  Location?: Location[];
}

interface CollectionTagData {
  tag: string;
}

interface Field {
  locked: boolean;
  name: string;
}

interface Location {
  path: string;
}

export interface Media {
  id: number;
  duration: number;
  bitrate: number;
  width?: number;
  height?: number;
  aspectRatio?: number;
  audioChannels?: number;
  audioCodec?: string;
  videoCodec?: string;
  videoResolution?: string;
  container?: string;
  videoFrameRate?: string;
  videoProfile: string;
  Part: Part[];
  audioProfile?: string;
}

export interface Part {
  id: number;
  key: string;
  duration: number;
  file: string;
  size: number;
  container: string;
  videoProfile: string;
  audioProfile?: string;
}
