// fakeMessages.js

const fakeMessages = [
  {
    id: "msg1",
    userName: "John Doe",
    senderId: "user123",
    receiverId: "user456",
    content: "This is a test message to check the UI.",
    timestamp: new Date(), // current date and time
    read: false,
  },
  {
    id: "msg2",
    userName: "Jane Smith",
    senderId: "user456",
    receiverId: "user123",
    content: "Hello, how are you doing today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    read: true,
  },
  {
    id: "msg3",
    userName: "Alice Johnson",
    senderId: "user789",
    receiverId: "user123",
    content: "Are you available for a meeting tomorrow?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
  },
  {
    id: "msg4",
    userName: "Bob Brown",
    senderId: "user123",
    receiverId: "user789",
    content: "Let's catch up soon. I have some updates for you.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
  {
    id: "msg5",
    userName: "Charlie Green",
    senderId: "user456",
    receiverId: "user789",
    content: "Did you get my last email regarding the project?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: false,
  },
];

export default fakeMessages;
