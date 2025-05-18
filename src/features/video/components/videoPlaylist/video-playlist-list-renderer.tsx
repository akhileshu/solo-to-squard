import { cn } from "@/lib/utils";
import { getVideoPlaylists, getVideoPlaylistById } from "@/features/videoPlaylist/actions/videoPlaylistActions";
import { VideoPlaylistListView } from "./video-playlist-list-view";
import { VideoPlaylistDetailCard } from "./video-playlist-detail-card";

// Render List of VideoPlaylists
export async function videoPlaylistListRenderer({ className }: { className?: string }) {
  const videoPlaylistsResult = await getVideoPlaylists();

  return (
    <VideoPlaylistListView videoPlaylistsResult={ videoPlaylistsResult } className={cn("", className)} />
  );
}

