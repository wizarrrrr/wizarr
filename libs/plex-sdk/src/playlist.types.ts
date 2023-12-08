export interface PlaylistResponse {
  ratingKey: string;
  key: string;
  guid: string;
  type: string;
  title: string;
  summary: string;
  smart: boolean;
  playlistType: string;
  composite: string;
  leafCount: number;
  addedAt: number;
  updatedAt: number;

  // below props might be for audio playlists?
  allowSync?: boolean;
  duration?: number;
  durationInSeconds?: number;
}
