"use client";
import { useSocketConnection } from "@/lib/socket-io/useSocketConnection";

const SendTestNotificationButton = () => {
  const { socket } = useSocketConnection();
  const sendNotification = () => {
    const userId = "cm9sdn8r30000ovafydttl8ta"; // name: 'Akhilesh Upadhyay',
    socket?.emit("send-notification", {
      userId,
      message: "Test Notification",
    });
    console.log("Notification sent!");
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <h2 className="mb-4">Send a Test Notification</h2>
      <button
        onClick={sendNotification}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
      >
        Send Notification
      </button>
    </div>
  );
};

export default SendTestNotificationButton;
