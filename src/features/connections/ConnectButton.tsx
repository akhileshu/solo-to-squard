"use client";

import { useState } from "react";
import { requestConnectionAction } from "@/features/connections/actions"; // Import the action

interface ConnectButtonProps {
  receiverId: string;
}

export function ConnectButton({ receiverId }: ConnectButtonProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false); // To disable after sending

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    // Simple message example, could be from a textarea
    const introMessage = "Hey, let's connect!";

    const result = await requestConnectionAction(receiverId, introMessage);

    setLoading(false);
    setMessage(result.message);
    if (result.success) {
      setIsSent(true); // Disable button or change text
    }
  };

  if (isSent) {
    return <button disabled>Request Sent</button>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Could add a message input here */}
      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Connect"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
