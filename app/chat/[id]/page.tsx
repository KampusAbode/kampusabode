"use client";

import ChatComponent from '../../components/features/chat/chat';
import { useRouter } from "next/navigation";


const ChatPage = () => {
   const router = useRouter();
   const { params } = router.query;
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

export default ChatPage;
