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

type ViewOrEditMatchingProps = {
  className?: string;
  matchingResult: Awaited<ReturnType<typeof placeholderActionFn>>;
};

export function ViewOrEditMatching({
  matchingResult,
  className,
}: ViewOrEditMatchingProps) {
    const cardTitle = "Matching";
  const { editing, startEditing, cancelEditing } = useEditToggle();
const statusMessage = renderStatusMessage(matchingResult, cardTitle);
  if (statusMessage || !matchingResult.ok) return statusMessage;

  const { data } = matchingResult;
  return (
    <AppCard title={cardTitle} className={cn("space-y-2", className)}>
      {!editing && (
        <Button onClick={startEditing}>
          Edit Matching
        </Button>
      )}

      {editing ? (
        <EditMatchingForm matching={data} onCancel={cancelEditing} />
      ) : (
        <ViewMatching matching={data} />
      )}
    </AppCard>
  );
}

function EditMatchingForm({
  matching,
  onCancel,
}: {
  matching: any;
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
        label: "Update Matching",
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

function ViewMatching({ matching }: { matching: any }) {
    return (
    <div className="space-y-2 text-sm text-gray-800">
      <p>Replace with actual read-only view</p>
      <pre>{JSON.stringify(matching, null, 2)}</pre>
    </div>
  );
}
