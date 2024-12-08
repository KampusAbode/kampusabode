"use client";

import ChatComponent from "../../../components/features/chat/chat";


type ChatProps = {
  params: {
    id: string[];
  };
};

const Chat = ({ params }: ChatProps) => {
  const [username, userId] = params.id;
  return (
    <ChatComponent
      currentUserId="kampusabode"
      receiverId={userId}
      currentUserName="Kampusabode"
      receiverName={username}
    />
  );
};

export default Chat;
