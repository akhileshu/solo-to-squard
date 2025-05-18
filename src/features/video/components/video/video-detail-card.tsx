"use client";

import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { cn } from "@/lib/utils";
import { getVideos, getVideoById } from "@/features/video/actions/videoActions";

import { useEditToggle } from "@/lib/forms-inputs/utils";
import { Button } from "@/lib/forms-inputs/button";
import { EditVideoForm } from "./edit-video-form";


type VideoDetailCardProps = {
  className?: string;
  videoResult: Awaited<ReturnType<typeof getVideoById>>;
};

export function VideoDetailCard({
  videoResult,
  className,
}: VideoDetailCardProps) {
  const cardTitle = "Video";

  const { editing, startEditing, cancelEditing } = useEditToggle();
  const statusMessage = renderStatusMessage(videoResult, cardTitle);
  if (statusMessage || !videoResult.ok) return statusMessage;

  const { data } = videoResult;


  return (
    <AppCard title={cardTitle} className={cn("space-y-2", className)}>
      {editing ? (
        <EditVideoForm video={data} onCancel={cancelEditing} />
      ) : (
        <>
          <Button disabled={editing} onClick={startEditing}>Edit</Button>
          <RenderVideo video={data} />
        </>
      )}
    </AppCard>
  );
}

