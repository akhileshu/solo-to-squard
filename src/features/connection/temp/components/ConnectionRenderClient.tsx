"use client";

import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { getConnections, getConnectionById } from "@/features/connection/actions/connectionActions";
import { cn } from "@/lib/utils";

type RenderConnectionsProps = {
  className?: string;
  connectionsResult: Awaited<ReturnType<typeof getConnections>>;
};

type RenderConnectionProps = {
  className?: string;
  connectionResult: Awaited<ReturnType<typeof getConnectionById>>;
};

// For List
export function RenderConnections({
  connectionsResult,
  className,
}: RenderConnectionsProps) {
  const cardTitle = "Connection List";

  const statusMessage = renderStatusMessage(connectionsResult, cardTitle);
  if (statusMessage || !connectionsResult.ok) return statusMessage;

  const { data } = connectionsResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      <div className="divide-y">
        {data.map((item) => (
          <div key={item.id} className="">
            {/* Render your item here */}
          </div>
        ))}
      </div>
    </AppCard>
  );
}

// For Single Item
export function RenderConnection({
  connectionResult,
  className,
}: RenderConnectionProps) {
  const cardTitle = "Connection";

  const statusMessage = renderStatusMessage(connectionResult, cardTitle);
  if (statusMessage || !connectionResult.ok) return statusMessage;

  const { data } = connectionResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      <div className="divide-y">
        <div key={data.id} className="">
          {/* Render your item here */}
        </div>
      </div>
    </AppCard>
  );
}
