"use client";

import Header from "./components/header/Header";
import Navigation from "./components/navigation/Navigation";
import Nav from "./components/navMenu/nav";
import QuickService from "./components/quickservice/QuickService";
import { useUserStore } from "./store/userStore";
// import { generateToken, messaging } from "./lib/messaging";
// import { onMessage } from "firebase/messaging";
// import { useEffect } from "react";
import { useRequireUser } from "./hooks/useRequireUser";
// import { logoutUser } from "./utils";
import Loader from "./components/loader/Loader";
import { useAuthListener } from "./hooks/useAuthListener";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  // const { user } = useUserStore((state) => state);
  // const { authenticated, checking } = useRequireUser();
  const { user } = useUserStore();
  const { initializing } = useAuthListener();

  // if (checking && authenticated === null) {
  //   return <Loader/>;
  // }
  if (initializing) {
    return <Loader />;
  }




  // useEffect(() => {
  //   generateToken();
  //   onMessage(messaging, (payload) => {
  //     console.log("Message received. ", payload);
  //     // Handle the message here
  //   });
  // }, []);

  return (
    <div className={`wrapper `}>
      <Nav />
      <main>
        <Header />
        {children}

        <QuickService />
      </main>
      <Navigation />
    </div>
  );
}
