import { cn } from "@/lib/utils";
import { getVideoPlaylists, getVideoPlaylistById } from "@/features/videoPlaylist/actions/videoPlaylistActions";
import { VideoPlaylistListView } from "@/features/videoPlaylist/components/VideoPlaylistListView";
import { VideoPlaylistDetailCard } from "@/features/videoPlaylist/components/VideoPlaylistDetailCard";

// Render List of VideoPlaylists
export async function RenderVideoPlaylists({ className }: { className?: string }) {
  const videoPlaylistsResult = await getVideoPlaylists();

  return (
    <VideoPlaylistListView videoPlaylistsResult={ videoPlaylistsResult } className={cn("", className)} />
  );
}

