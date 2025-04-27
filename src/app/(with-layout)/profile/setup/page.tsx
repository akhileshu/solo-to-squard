// pages/setup-profile.tsx
"use client";
import AppForm from "@/lib/forms-inputs/form";
import { updateUserProfileAction } from "@/features/profile/actions";
import { useHandleFormState } from "@/lib/forms-inputs/useHandleFormState";
import { initialState } from "@/lib/server-actions/handleAction";
import { useActionState } from "react";

export default function SetupProfile() {
  const [state, formAction, isPending] = useActionState(
    updateUserProfileAction,
    initialState
  );

  const { fieldErrors } = state ?? {};

  useHandleFormState({
    state,
    revalidatePath: "/dashboard",
    navigateTo: "/dashboard",
  });


  return (
    <AppForm
      className="flex gap-2 flex-col"
      action={formAction}
      submitVariant="default"
      submitProps={{
        buttonState: {
          tooltip: "",
          disabled: isPending,
        },
        className: "w-fit",
        isPending: isPending,
        label: "update profile",
      }}
    >
      <label>
        Role:
        <input type="text" placeholder="e.g. Developer, Designer" />
      </label>
      <label>
        Skills:
        <input type="text" placeholder="e.g. Node.js, React, UX Design" />
      </label>
      <label>
        Goals:
        <textarea placeholder="What are you looking for in a connection?" />
      </label>
      <label>
        Time Commitment:
        <input type="text" placeholder="e.g. 30 minutes a week, 1 hour a day" />
      </label>
      <label>
        Vibe:
        <input type="text" placeholder="e.g. chill, energetic, serious" />
      </label>
      <input placeholder="Role" />
      <input placeholder="Skills (comma separated)" />
      <input placeholder="Goals" />
      <input placeholder="Time Commitment" />
      <input placeholder="Vibe" />
    </AppForm>

  );
}
