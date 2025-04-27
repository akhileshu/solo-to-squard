"use client";

import { useActionState } from "react";
import { initialState } from "@/lib/server-actions/handleAction";
import AppForm from "@/lib/forms-inputs/form";
import { deleteCart } from "../actions/cartActions";
import { useHandleFormState } from "@/lib/forms-inputs/useHandleFormState";

export default function DeleteCartForm({ id }: { id: number }) {
  const [state, formAction, isPending] = useActionState(deleteCart, initialState);

  useHandleFormState({
    state,
    revalidatePath: "/dashboard",
  });

  return (
    <AppForm
      action={formAction}
      variant="delete"
      confirmation={ {
        message: "Are you sure you want to delete?",
        enabled: true,
      } }
      submitVariant="default"
      submitProps={ {
        isPending,
        buttonState: { disabled: isPending },
        label: "Delete",
      } }
    >
      <input type="hidden" name="id" value={id} />
    </AppForm>
  );
}
