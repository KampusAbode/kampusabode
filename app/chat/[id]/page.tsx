"use client";

import ChatComponent from '../../components/features/chat/chat';
import { useParams } from "next/navigation";


const Chat = () => {
   const params = useParams()
   const username = params?.[0];
   const userId = params?.[1]; 
 

  return (
    <ChatComponent
      currentUserId={userId}
      receiverId="kampusabode"
      currentUserName={username} 
      receiverName="Kampusabode"
    />
  );
};

export default Chat;
