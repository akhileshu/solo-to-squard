export const pendingReceivedRequests = {
  data: [
    {
      id: "1",
      senderId: "u1",
      receiverId: "u2",
      message: "Let’s connect!",
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: {
        id: "u1",
        name: "Akhil Dev",
        image: "https://i.pravatar.cc/100?img=1",
      },
    },
    {
      id: "2",
      senderId: "u3",
      receiverId: "u2",
      message: "",
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: {
        id: "u3",
        name: "Priya Sharma",
        image: null, // will fallback to default-avatar.png
      },
    },
    {
      id: "3",
      senderId: "u4",
      receiverId: "u2",
      message: "Hey, we met at the event!",
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: {
        id: "u4",
        name: "Ravi Kumar",
        image: "https://i.pravatar.cc/100?img=5",
      },
    },
  ],
};
