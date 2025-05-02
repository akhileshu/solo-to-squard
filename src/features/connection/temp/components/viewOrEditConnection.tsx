"use client";

import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { Button } from "@/lib/forms-inputs/button";
import AppForm from "@/lib/forms-inputs/form";
import { Input } from "@/lib/forms-inputs/Input";
import { MultiSelect } from "@/lib/forms-inputs/MultiSelect";
import { Select } from "@/lib/forms-inputs/Select";
import { useHandleFormState } from "@/lib/forms-inputs/useHandleFormState";
import { useEditToggle } from "@/lib/forms-inputs/utils";
import { initialState } from "@/lib/server-actions/handleAction";
import { cn } from "@/lib/utils";
import { useActionState, useEffect } from "react";

type ViewOrEditConnectionProps = {
  className?: string;
  connectionResult: Awaited<ReturnType<typeof placeholderActionFn>>;
};

export function ViewOrEditConnection({
  connectionResult,
  className,
}: ViewOrEditConnectionProps) {
    const cardTitle = "Connection";
  const { editing, startEditing, cancelEditing } = useEditToggle();
const statusMessage = renderStatusMessage(connectionResult, cardTitle);
  if (statusMessage || !connectionResult.ok) return statusMessage;

  const { data } = connectionResult;
  return (
    <AppCard title={cardTitle} className={cn("space-y-2", className)}>
      {!editing && (
        <Button onClick={startEditing}>
          Edit Connection
        </Button>
      )}

      {editing ? (
        <EditConnectionForm connection={data} onCancel={cancelEditing} />
      ) : (
        <ViewConnection connection={data} />
      )}
    </AppCard>
  );
}

function EditConnectionForm({
  connection,
  onCancel,
}: {
  connection: any;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    placeholderActionFn,
    initialState
  );
  const { fieldErrors } = state ?? {};

  useHandleFormState({
    state,
    revalidatePath: "/placeholderPath",
  });

  useEffect(() => {
    if (state.ok) {
      onCancel();
    }
  }, [onCancel, state.ok]);

  return (
    <AppForm
      className="space-y-4 max-w-md"
      action={formAction}
      variant="default"
      submitVariant="default"
      submitProps={ {
        isPending,
        buttonState: { disabled: isPending },
        label: "Update Connection",
      } }
    >
      <p>Edit form goes here.</p>
      <Button
        className="mr-2 text-red-600"
        disabled={isPending}
        onClick={onCancel}
      >
        Cancel
      </Button>
    </AppForm>

  );
}

function ViewConnection({ connection }: { connection: any }) {
    return (
    <div className="space-y-2 text-sm text-gray-800">
      <p>Replace with actual read-only view</p>
      <pre>{JSON.stringify(connection, null, 2)}</pre>
    </div>
  );
}
