import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { getMatchings, getMatchingById } from "@/features/matching/actions/matchingActions";
import { cn, formatDate } from "@/lib/utils";

// Render List of Matchings
export async function RenderMatchings({ className }: { className?: string }) {
  const matchingsResult = await getMatchings();
  const cardTitle = "Matching List";
  
  const statusMessage = renderStatusMessage(matchingsResult, cardTitle);
  if (statusMessage || !matchingsResult.ok) return statusMessage;

  const { data } = matchingsResult;

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

// Render Single Matching
export async function RenderMatching({ id, className }: { id: string; className?: string }) {
  const matchingResult = await getMatchingById(id);
  const cardTitle = "Matching";
  
  const statusMessage = renderStatusMessage(matchingResult, cardTitle);
  if (statusMessage || !matchingResult.ok) return statusMessage;

  const { data } = matchingResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      <div key={data.id}>
        {/* Render your item here */}
      </div>
    </AppCard>
  );
}
