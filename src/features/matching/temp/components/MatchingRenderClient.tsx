"use client";

import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { getMatchings, getMatchingById } from "@/features/matching/actions/matchingActions";
import { cn } from "@/lib/utils";

type RenderMatchingsProps = {
  className?: string;
  matchingsResult: Awaited<ReturnType<typeof getMatchings>>;
};

type RenderMatchingProps = {
  className?: string;
  matchingResult: Awaited<ReturnType<typeof getMatchingById>>;
};

// For List
export function RenderMatchings({
  matchingsResult,
  className,
}: RenderMatchingsProps) {
  const cardTitle = "Matching List";

  const statusMessage = renderStatusMessage(matchingsResult, cardTitle);
  if (statusMessage || !matchingsResult.ok) return statusMessage;

  const { data } = matchingsResult;

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
export function RenderMatching({
  matchingResult,
  className,
}: RenderMatchingProps) {
  const cardTitle = "Matching";

  const statusMessage = renderStatusMessage(matchingResult, cardTitle);
  if (statusMessage || !matchingResult.ok) return statusMessage;

  const { data } = matchingResult;

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
