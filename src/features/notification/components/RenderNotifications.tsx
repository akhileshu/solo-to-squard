"use client";

import { useSocketConnection } from "@/lib/socket-io/useSocketConnection";
import { useSession } from "next-auth/react";
import { useState } from "react";

type Notification = {
  message: string;
};

export default function RenderNotifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  if (!session?.user.id) throw new Error("No user id");
  const onNotification: (data: { message: string }) => void = (data) => {
    setNotifications((prev) => [data, ...prev]);
  };
  useSocketConnection(onNotification);
  /*
  socket?.on("new-notification", (data) => {
    setNotifications((prev) => [data, ...prev]);
  });
*/
  const markAsSeen = (index: number) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <SocketConnectionStatus />
      <h2 className="font-bold mb-2">Notifications</h2>
      {notifications.map((notif, i) => (
        <div key={i} className="flex justify-between p-2 border mb-1 rounded">
          <span>{notif.message}</span>
          <button onClick={() => markAsSeen(i)}>Seen</button>
        </div>
      ))}
    </div>
  );
}

function SocketConnectionStatus() {
  const { isConnected, transport } = useSocketConnection();

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
    </div>
  );
}
