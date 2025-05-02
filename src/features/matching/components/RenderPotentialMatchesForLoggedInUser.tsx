import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import {  getPotentialMatchesForLoggedInUser } from "@/features/matching/actions/matchingActions";
import { cn } from "@/lib/utils";
import { generateMatchLabel } from "../lib";
import Image from "next/image";
import { SendConnectRequestButton } from "@/features/connection/components/SendConnectRequestButton";

// Render List of Matchings
export async function RenderPotentialMatchesForLoggedInUser({ className }: { className?: string }) {
  const potentialMatches = await getPotentialMatchesForLoggedInUser();
  const cardTitle = "Recommended Matchings - You Might Click";
  
  const statusMessage = renderStatusMessage(potentialMatches, cardTitle);
  if (statusMessage || !potentialMatches.ok) return statusMessage;

  const { data } = potentialMatches;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      <div className="flex gap-4 flex-wrap">
        {data.map((match) => (
          <li className="list-none w-xs border rounded-md p-2" key={match.id}>
            <Image
              src={match.image ?? "/default-avatar.png"}
              alt={match.name ?? "User"}
              width={500}
              height={280}
              className="w-full object-cover h-52 rounded-md"
              // onError={() => setImgSrc(siteLinks.noDataImage)}
            />
            <h3>{match.name}</h3>
            <p>{match.domain}</p>
            <p>Skills: {match.skills.join(", ")}</p>
            <p>Label: {generateMatchLabel(match)}</p>
            {/* Connect Button - Passes receiverId to a Client Component */}
            <SendConnectRequestButton receiverId={match.id} />
          </li>
        ))}
      </div>
    </AppCard>
  );
}
