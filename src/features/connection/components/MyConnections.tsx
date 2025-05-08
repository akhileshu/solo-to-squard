import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { cn } from "@/lib/utils";
import { getAcceptedConnections } from "../actions/connectionActions";
import AppImg from "@/components/app/AppImg";
import Link from "next/link";

// Render List of Connections
export async function MyConnections({ className }: { className?: string }) {
  const connectionsResult = await getAcceptedConnections();
  const cardTitle = "Connection List";
  
  const statusMessage = renderStatusMessage(connectionsResult, cardTitle);
  if (statusMessage || !connectionsResult.ok) return statusMessage;

  const { data } = connectionsResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      {data.map((item) => (
        <Link key={item.id} href={`/profile/${item.id}`}>
          <div className="flex items-center gap-4 p-3 border rounded-md hover:shadow-sm transition-all">
            <AppImg
              src={item.image}
              alt={item.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm">
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-600">{item.domain || "No domain"}</p>
              <p className="text-gray-500 text-xs">
                Skills: {item.skills?.join(", ") || "None"}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </AppCard>
  );
}

