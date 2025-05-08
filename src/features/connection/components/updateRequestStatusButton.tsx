"use client";

import { Button } from "@/lib/forms-inputs/button";
import AppForm from "@/lib/forms-inputs/form";
import { useHandleFormState } from "@/lib/forms-inputs/useHandleFormState";
import { initialState } from "@/lib/server-actions/handleAction";
import { useActionState, useState } from "react";
import { updateConnectionStatus } from "../actions/connectionActions";
import { ConnectionStatus } from "@prisma/client";

export function UpdateRequestStatusButton({
  connectionId,
  className,
}: {
  connectionId: string;
  className?: string;
}) {
  const [newStatus, setNewStatus] = useState<ConnectionStatus>("PENDING");
  const [state, formAction, isPending] = useActionState(
    updateConnectionStatus,
    initialState
  );
  const { fieldErrors } = state ?? {};

  useHandleFormState({
    state,
    revalidatePath: "/connections/recommendations",
    // todo : allow revalidate an array of paths
  });


  return (
    <AppForm
      className="space-y-4 max-w-md"
      action={formAction}
      variant="default"
      submitVariant="custom"
    >
      <div className="flex gap-2 mt-2">
        <input type="hidden" name="newStatus" value={newStatus} />
        <input type="hidden" name="connectionId" value={connectionId} />
        <Button
          onClick={() => setNewStatus("ACCEPTED")}
          disabled={isPending}
          className="flex-1 bg-green-600 text-white px-3 py-1.5 text-xs rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
        >
          Approve
        </Button>
        <Button
          onClick={() => setNewStatus("DECLINED")}
          disabled={isPending}
          className="flex-1 bg-white text-red-600 border border-red-300 px-3 py-1.5 text-xs rounded-md hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          Reject
        </Button>
      </div>
    </AppForm>
  );
}

