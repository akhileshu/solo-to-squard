"use client";

import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { Button } from "@/lib/forms-inputs/button";
import AppForm from "@/lib/forms-inputs/form";
import { useHandleFormState } from "@/lib/forms-inputs/useHandleFormState";
import { initialState } from "@/lib/server-actions/handleAction";
import { useActionState, useEffect } from "react";

type EditVideoFormProps = {
  video: any;
  onCancel?: () => void;
};

export function EditVideoForm({ video, onCancel }: EditVideoFormProps) {
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
    if (state.ok && onCancel) {
      onCancel();
    }
  }, [onCancel, state.ok]);

  return (
    <AppCard title="Edit Video">
      <AppForm
        className="space-y-4 max-w-md"
        action={formAction}
        variant="default"
        submitVariant="default"
        submitProps={ {
          isPending,
          buttonState: { disabled: isPending },
          label: "Update Video",
        } }
      >
        <p>Edit form fields for video go here.</p>

        {onCancel && (
          <Button
            className="mr-2 text-red-600"
            disabled={isPending}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </AppForm>
    </AppCard>
  );
}
