"use client";

import ChatComponent from "../../components/features/chat/chat";
import { useRouter } from "next/navigation";


const Chat = () => {
  const router = useRouter();
  const { params } = router.query;
  const username = params?.[0];
  const receiverId = params?.[1]; 
  
  return (
    <ChatComponent
      currentUserId="kampusabode"
      receiverId={receiverId}
      currentUserName="Kampusabode"
      receiverName={username} 
    />
  );
};

export default Chat;
