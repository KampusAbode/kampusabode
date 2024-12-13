"use client";
import ChatComponent from '../../../components/features/chat/chat';

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
      currentUserId={userid}
      receiverId="kampusabode2384719744"
      currentUserName={username} 
      receiverName="Kampusabode"
    />
  );
};

export default Chat;
