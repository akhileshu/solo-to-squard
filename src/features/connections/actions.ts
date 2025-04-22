"use server"; // Mark this module as containing Server Actions

import { sendConnectionRequest } from "@/features/connections/connections";
import { getServerUser } from "@/lib/auth/lib";


export async function requestConnectionAction(
  receiverId: string,
  message?: string
) {
  const sender = await getServerUser()
  if (!sender) {
    return { success: false, message: "Authentication required." };
  }

  try {
    const connection = await sendConnectionRequest(
      sender.id,
      receiverId,
      message
    );
    if (connection) {
      // Optionally revalidate paths if needed (e.g., if the button should change state)
      // revalidatePath('/dashboard');
      return { success: true, message: "Connection request sent!" };
    } else {
      // sendConnectionRequest returns null on known failures (e.g., already exists)
      return {
        success: false,
        message: "Could not send request (maybe one already exists?).",
      };
    }
  } catch (error) {
    console.error("Connection request error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
