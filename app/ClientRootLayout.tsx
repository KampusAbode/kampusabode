"use client";

import { Toaster } from "react-hot-toast";
import Header from "./components/header/Header";
import WelcomeMessage from "./components/welcome/WelcomeMessage";
import Navigation from "./components/navigation/Navigation";
import { getAuthState } from "./utils";
import { ReduxProvider } from "./redux/provider";
import UseIsUser from "./hooks/useIsUser";
import Nav from "./components/navMenu/nav";
import { useState, useEffect } from "react";
import Loader from "./components/loader/Loader";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector((state: RootState) => state.user) as {
    isAuthenticated: boolean;
    id: string;
    username: string;
    userType: string;
  };

  return (
    <ReduxProvider>
      <Toaster />
      <WelcomeMessage />
      <div className={`wrapper ${user.isAuthenticated ? "grid" : ""}`}>
        <UseIsUser>
          <Nav />
          <main>
            <Header />
            {children}
          </main>
          <Navigation />
        </UseIsUser>
      </div>
    </ReduxProvider>
  );
}
