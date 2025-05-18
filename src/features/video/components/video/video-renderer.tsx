import { cn } from "@/lib/utils";
import { getVideos, getVideoById } from "@/features/video/actions/videoActions";
import { VideoListView } from "./video-list-view";
import { VideoDetailCard } from "./video-detail-card";

// Render Single Video
export async function videoRenderer({ id, className }: { id: string; className?: string }) {
  const videoResult = await getVideoById(id);

  return (
    <VideoDetailCard videoResult={ videoResult } className={cn("", className)} />
  );
}
