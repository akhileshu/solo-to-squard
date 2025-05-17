import { cn } from "@/lib/utils";
import { getVideos, getVideoById } from "@/features/video/actions/videoActions";
import { VideoListView } from "@/features/video/components/VideoListView";
import { VideoDetailCard } from "@/features/video/components/VideoDetailCard";

// Render Single Video
export async function RenderVideo({ id, className }: { id: string; className?: string }) {
  const videoResult = await getVideoById(id);

  return (
    <VideoDetailCard videoResult={ videoResult } className={cn("", className)} />
  );
}
