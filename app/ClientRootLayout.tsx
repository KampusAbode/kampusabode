"use client";

import Header from "./components/header/Header";
import Navigation from "./components/navigation/Navigation";
import Nav from "./components/navMenu/nav";
import QuickService from "./components/quickservice/QuickService";
import { useUserStore } from "./store/userStore";
import { generateToken, messaging } from "./lib/messaging";
import { onMessage } from "firebase/messaging";
import { useEffect } from "react";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
     
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </>
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore((state) => state);

  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      // Handle the message here
    });
  }, []);

  return (
    <div className={`wrapper ${user ? "grid" : "none"}`}>
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
