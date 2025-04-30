"use client";

import { allGoals, allSkills, domains } from "@/lib/data/profile";
import AppForm from "@/lib/forms-inputs/form";
import { Input } from "@/lib/forms-inputs/Input";
import { MultiSelect } from "@/lib/forms-inputs/MultiSelect";
import { Select } from "@/lib/forms-inputs/Select";
import { useHandleFormState } from "@/lib/forms-inputs/useHandleFormState";
import { logFormData } from "@/lib/forms-inputs/utils";
import { initialState } from "@/lib/server-actions/handleAction";
import { useSession } from "next-auth/react";
import { useActionState, useEffect } from "react";
import { setupProfile } from "../actions/profileActions";

export default function SetupProfileForm() {
  const { update } = useSession();
  const [state, formAction, isPending] = useActionState(
    setupProfile,
    initialState
  );

  const { fieldErrors } = state ?? {};

  useHandleFormState({
    state,
    revalidatePath: "/dashboard",
    navigateTo: "/dashboard",
  });


  useEffect(() => {
    if (state.ok) {
      update({ isProfileSetupDone: true });
    }
  }, [state.ok, update])
  
  

  return (
    <AppForm
      action={formAction}
      onSubmit={(e) => {
        // e.preventDefault();
        logFormData(e.currentTarget);
      }}
      className="space-y-4 max-w-md"
      submitVariant="default"
      submitProps={{
        isPending,
        buttonState: { disabled: isPending, tooltip: "" },
        label: "Submit",
      }}
    >
      <Select
        label="Domain"
        name="domain"
        options={domains.map((d) => ({ label: d, value: d }))}
        fieldError={fieldErrors?.domain}
      />

      <MultiSelect
        label="Skills"
        name="skills"
        options={allSkills.map((skill) => ({ label: skill, value: skill }))}
        fieldError={fieldErrors?.skills}
      />

      <MultiSelect
        label="Learning Goals"
        name="learning"
        options={allSkills.map((skill) => ({ label: skill, value: skill }))}
        fieldError={fieldErrors?.learning}
      />

      <MultiSelect
        label="Your Goals"
        name="goals"
        options={allGoals.map((goal) => ({ label: goal, value: goal }))}
        fieldError={fieldErrors?.goals}
      />

      <Input
        label="Availability (hours/week)"
        name="availability"
        type="number"
        min={1}
        max={168}
        fullWidth
        fieldError={fieldErrors?.availability}
      />

    </AppForm>
  );
}
