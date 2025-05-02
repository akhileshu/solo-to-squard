import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { getConnections, getConnectionById } from "@/features/connection/actions/connectionActions";
import { cn, formatDate } from "@/lib/utils";

// Render List of Connections
export async function RenderConnections({ className }: { className?: string }) {
  const connectionsResult = await getConnections();
  const cardTitle = "Connection List";
  
  const statusMessage = renderStatusMessage(connectionsResult, cardTitle);
  if (statusMessage || !connectionsResult.ok) return statusMessage;

  const { data } = connectionsResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      {data.map((item) => (
        <div key={item.id}>
          {/* Render your item here */}
        </div>
      ))}
    </AppCard>
  );
}

// Render Single Connection
export async function RenderConnection({ id, className }: { id: string; className?: string }) {
  const connectionResult = await getConnectionById(id);
  const cardTitle = "Connection";
  
  const statusMessage = renderStatusMessage(connectionResult, cardTitle);
  if (statusMessage || !connectionResult.ok) return statusMessage;

  const { data } = connectionResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      <div key={data.id}>
        {/* Render your item here */}
      </div>
    </AppCard>
  );
}
