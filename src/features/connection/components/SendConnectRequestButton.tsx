"use client";

import AppForm from "@/lib/forms-inputs/form";
import { useHandleFormState } from "@/lib/forms-inputs/useHandleFormState";
import { initialState } from "@/lib/server-actions/handleAction";
import { cn } from "@/lib/utils";
import { useActionState, useEffect } from "react";
import { sendConnectionRequest } from "../actions/connectionActions";

type SendConnectRequestProps = {
  className?: string;
  receiverId: string;
  onSuccess?: () => void;
};

export function SendConnectRequestButton({
  receiverId,
  className,
  onSuccess,
}: SendConnectRequestProps) {
  const [state, formAction, isPending] = useActionState(
    sendConnectionRequest,
    initialState
  );
  // const { fieldErrors } = state ?? {};

  useHandleFormState({
    state,
    revalidatePath: "/placeholderPath",
    // todo : revalidate potential matching list on success to exclude this matching to whome we sent request

  });

  useEffect(() => {
    if (state.ok) {
      onSuccess?.(); // safe call
      /*
      show profile in connections / pending connections
       */
    }
  }, [onSuccess, state.ok]);
    const message = "Hey, let's connect!";
  return (
    <AppForm
      // todo : in template enable using classname with cn
      className={cn("space-y-4 max-w-md", className)}
      action={formAction}
      variant="default"
      submitVariant="default"
      /*
      todo improvements :
dynamic button label based on connection status : ex: "Request Sent - waiting approval etc", "Connect"
      */
      submitProps={{
        isPending,
        buttonState: { disabled: isPending },
        label: state.ok ? "Request Sent ✅" : "Connect",
        className:"bg-blue-500 text-white font-bold",
      }}
    >
      <input type="hidden" name="receiverId" value={receiverId} />
      <input type="hidden" name="message" value={message} />
    </AppForm>
  );
}



