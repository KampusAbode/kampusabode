"use client";

import ChatComponent from "../../../components/features/chat/chat";

type ChatProps = {
  params: {
    username: string;
    userid: string;
  };
};

const Chat = ({ params }: ChatProps) => {
  const { username, userid } = params; 

  return (
    <ChatComponent
      currentUserId="kampusabode"
      receiverId={userid} // Use the corrected property
      currentUserName="Kampusabode"
      receiverName={username}
    />
  );
};

export default Chat;
