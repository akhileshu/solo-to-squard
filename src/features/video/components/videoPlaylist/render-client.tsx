"use client";

import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { cn } from "@/lib/utils";
import { getVideoPlaylists, getVideoPlaylistById } from "@/features/videoPlaylist/actions/videoPlaylistActions";

import { useEditToggle } from "@/lib/forms-inputs/utils";
import { Button } from "@/lib/forms-inputs/button";
import { EditVideoPlaylistForm } from "./EditVideoPlaylistForm";


type VideoPlaylistDetailCardProps = {
  className?: string;
  videoPlaylistResult: Awaited<ReturnType<typeof getVideoPlaylistById>>;
};

export function VideoPlaylistDetailCard({
  videoPlaylistResult,
  className,
}: VideoPlaylistDetailCardProps) {
  const cardTitle = "VideoPlaylist";

  const statusMessage = renderStatusMessage(videoPlaylistResult, cardTitle);
  if (statusMessage || !videoPlaylistResult.ok) return statusMessage;

  const { data } = videoPlaylistResult;

  const { editing, startEditing, cancelEditing } = useEditToggle();

  return (
    <AppCard title={cardTitle} className={cn("space-y-2", className)}>
      {editing ? (
        <EditVideoPlaylistForm videoPlaylist={data} onCancel={cancelEditing} />
      ) : (
        <>
          <Button onClick={startEditing}>Edit</Button>
          <RenderVideoPlaylist videoPlaylist={data} />
        </>
      )}
    </AppCard>
  );
}

type VideoPlaylistListViewProps = {
  className?: string;
  videoPlaylistsResult: Awaited<ReturnType<typeof getVideoPlaylists>>;
};

export function VideoPlaylistListView({
  videoPlaylistsResult,
  className,
}: VideoPlaylistListViewProps) {
  const cardTitle = "VideoPlaylist List";

  const statusMessage = renderStatusMessage(videoPlaylistsResult, cardTitle);
  if (statusMessage || !videoPlaylistsResult.ok) return statusMessage;

  const { data } = videoPlaylistsResult;

  return (
    <AppCard title={cardTitle} className={cn("space-y-4", className)}>
      {data.map((item) => (
        <VideoPlaylistDetailCard key={item.id} videoPlaylistResult={ { ok: true, data: item } } />
      ))}
    </AppCard>
  );
}
