"use client";

import AppImg from "@/components/app/AppImg";
import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { useQueryParamController } from "@/lib/url-state/useQueryParamController";
import { cn } from "@/lib/utils";
import { getConnectionRequests } from "../actions/connectionActions";
import { fetchConnReqSchema } from "../schemas/connectionSchemas";
import { useSession } from "next-auth/react";
import { UpdateRequestStatusButton } from "./updateRequestStatusButton";

export function ConnectionRequestsPage({
  className,
  requestsResult,
}: {
  className?: string;
  requestsResult: Awaited<ReturnType<typeof getConnectionRequests>>;
}) {
  const { getParam } = useQueryParamController();
  const {data:session} = useSession();


  const cardTitle = "ConnectionRequests";
  const statusMessage = renderStatusMessage(requestsResult, cardTitle,undefined,false);
  if (statusMessage || !requestsResult.ok) return statusMessage;
  // const { data } = pendingReceivedRequests ?? requestsResult;
  const { data } = requestsResult;


  const { data: parsedSearchedParams, error: searchParamsError } =
    fetchConnReqSchema.safeParse({
      status: getParam("status") ,
      direction: getParam("direction"),
    });
  if (searchParamsError) return <p>{searchParamsError.message}</p>;
  const { status, direction } = parsedSearchedParams;

  return (
    <div className={cn("space-y-4", className)}>
      <ConnectionRequestsFilters direction={direction} status={status} />

      <AppCard title="Connection Requests" className="space-y-3">
        {data.map((item) => {
          const youAreSender = item.sender.id === session?.user.id;
          const profile = youAreSender ? item.receiver : item.sender;
          const contextMessage = youAreSender
            ? `You sent a request to ${profile.name}`
            : `${profile.name} sent you a request`;

          return (
            <div
              key={item.id}
              className={cn(
                "flex gap-4 p-4 border rounded-lg max-w-md transition-all hover:shadow-sm",
                youAreSender
                  ? "bg-green-50 border-green-100"
                  : "bg-gray-50 border-gray-200"
              )}
            >
              {!youAreSender && (
                <AppImg
                  src={profile.image}
                  alt={profile.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
              )}

              <div className="flex flex-col flex-1 gap-1 text-sm">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-gray-900">{profile.name}</p>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      item.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : item.status === "ACCEPTED"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-gray-600">{contextMessage}</p>

                {item.message && (
                  <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                    <p className="text-gray-700 italic">{item.message}</p>
                  </div>
                )}

                {!youAreSender && item.status === "PENDING" && (
                  <UpdateRequestStatusButton connectionId={item.id} />
                )}
              </div>
            </div>
          );
        })}
      </AppCard>
    </div>
  );
}

function ConnectionRequestsFilters({
  direction,
  status,
}: {
  direction: string;
  status: string;
}) {
  const { updateParam } = useQueryParamController();

  return (
    <div className="flex gap-2">
      <select
        value={direction}
        onChange={(e) => updateParam("direction", e.target.value, true)}
        className="border px-2 py-1 rounded text-sm"
      >
        <option value="all">All</option>
        <option value="incoming">Received</option>
        <option value="outgoing">Sent</option>
      </select>

      <select
        value={status}
        onChange={(e) => updateParam("status", e.target.value, true)}
        className="border px-2 py-1 rounded text-sm"
      >
        <option value="all">All</option>
        <option value="PENDING">Pending</option>
        <option value="ACCEPTED">Accepted</option>
        <option value="DECLINED">Declined</option>
      </select>
    </div>
  );
}